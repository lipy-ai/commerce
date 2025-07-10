import {
	type SkipToken,
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
	type UseSuspenseQueryOptions,
	type UseSuspenseQueryResult,
	useMutation as useRQMutation,
	useQuery as useRQQuery,
	useSuspenseQuery as useRQSuspenseQuery,
} from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import type { UseFormReturn } from "react-hook-form";

import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
	StatusCode,
	SuccessStatusCode,
} from "hono/utils/http-status";
import { useRedirect } from "../hooks/use-navigate";

type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;

type HttpMethodKey =
	| "$get"
	| "$post"
	| "$put"
	| "$delete"
	| "$patch"
	| "$options"
	| "$head";

type AvailableMethodKeys<T> = Extract<keyof T, HttpMethodKey>;

type EndpointMethodParams<
	T extends object,
	M extends AvailableMethodKeys<T>,
> = T[M] extends (params: infer P, ...args: any[]) => any ? P : never;

type EndpointResponseType<
	T extends object,
	M extends AvailableMethodKeys<T>,
	U extends StatusCode = StatusCode,
> = T[M] extends (...args: any[]) => Promise<Response>
	? InferResponseType<T[M], U>
	: never;

function getPathFromUrl(url: string): string {
	try {
		if (url.startsWith("http")) {
			const urlObj = new URL(url);
			return urlObj.pathname;
		}
		return url;
	} catch {
		return url;
	}
}

type InferSelectReturnType<TData, TSelect> = TSelect extends (
	data: TData,
) => infer R
	? R
	: TData;

export type APIQueryKey<
	T extends object & { $url: () => URL | { toString: () => string } },
	M extends AvailableMethodKeys<T>,
	Params extends EndpointMethodParams<T, M>,
> = [M, string, Params];

export const getAPIQueryKey = <
	T extends object & { $url: () => URL | { toString: () => string } },
	M extends AvailableMethodKeys<T>,
	Params extends EndpointMethodParams<T, M>,
>(
	endpoint: T,
	method: M,
	params: Params,
): APIQueryKey<T, M, Params> => {
	const urlString = endpoint.$url().toString();
	const path = getPathFromUrl(urlString);

	const filteredParams = {} as any;
	if (params && typeof params === "object") {
		if ("param" in params) {
			filteredParams.param = params.param;
		}
		if ("query" in params) {
			filteredParams.query = params.query;
		}
	}
	return [method, path, filteredParams] as unknown as APIQueryKey<T, M, Params>;
};

export const apiQueryOptions = <
	T extends object & { $url: () => URL | { toString: () => string } },
	M extends AvailableMethodKeys<T>,
	Params extends EndpointMethodParams<T, M>,
	Options extends Omit<
		UseQueryOptions<
			TResponse,
			TError,
			InferSelectReturnType<TResponse, TError>,
			APIQueryKey<T, M, Params>
		>,
		"queryKey" | "queryFn"
	>,
	TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
	TError = EndpointResponseType<T, M, ErrorStatusCode>,
>(
	endpoint: T,
	method: M,
	params: Params,
	options?: Options,
): NoInfer<
	Omit<
		UseQueryOptions<
			TResponse,
			TError,
			InferSelectReturnType<TResponse, Options["select"]>,
			APIQueryKey<T, M, Params>
		>,
		"queryFn"
	> & {
		queryFn: Exclude<
			UseQueryOptions<
				TResponse,
				TError,
				InferSelectReturnType<TResponse, Options["select"]>,
				APIQueryKey<T, M, Params>
			>["queryFn"],
			SkipToken | undefined
		>;
	}
> => {
	const { handleNavigate } = useRedirect();

	const endpointFn = endpoint[method] as unknown as (
		params: any,
	) => Promise<Response>;
	const result = {
		queryKey: getAPIQueryKey(endpoint, method, params),
		queryFn: async () => {
			const res = await endpointFn(params);
			if (res.status >= 200 && res.status < 300) {
				return (await res.json()) as TResponse;
			}
			const errorData = (await res
				.json()
				.then((e) => {
					return e.error;
				})
				.catch(
					async (_e) =>
						await res
							.text()
							.catch((_f) => ({ message: "Failed to decode response..." })),
				)) as TError & {
				code?: string;
				cause: Record<string, any>;
				message?: string;
			};
			handleNavigate((errorData as any)?.code);

			const error = new Error(
				`Request failed with status ${res.status}`,
			) as Error & {
				status: number;
				data: TError;
			};

			error.status = res.status;
			error.data = errorData;

			throw error;
		},
		...options,
	};

	return result as any;
};

export const apiMutationOptions = <
	T extends object,
	M extends AvailableMethodKeys<T>,
	TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
	TError = EndpointResponseType<T, M, ErrorStatusCode>,
	TVariables = EndpointMethodParams<T, M>,
	TContext = unknown,
>(
	endpoint: T & { $url: () => URL | { toString: () => string } },
	method: M,
	options?: Omit<
		UseMutationOptions<TResponse, TError, TVariables, TContext>,
		"mutationFn" | "mutationKey"
	> & { form?: UseFormReturn<any> },
): UseMutationOptions<TResponse, TError, TVariables, TContext> => {
	const endpointFn = endpoint[method] as unknown as (
		params: TVariables,
	) => Promise<Response>;

	const { handleNavigate } = useRedirect();

	return {
		mutationKey: getAPIQueryKey(endpoint, method, {} as any),
		mutationFn: async (variables) => {
			const res = await endpointFn(variables);

			if (res.status >= 200 && res.status < 300) {
				return (await res.json()) as TResponse;
			}
			const errorData = (await res
				.json()
				.then((e) => {
					return e.error;
				})
				.catch(
					async (_e) =>
						await res
							.text()
							.catch((_f) => ({ message: "Failed to decode response..." })),
				)) as TError & {
				code?: string;
				cause: Record<string, any>;
				message?: string;
			};

			if (errorData?.code === "VALIDATION_ERR" && options?.form?.setError) {
				for (const [field, message] of Object.entries(errorData.cause.issues)) {
					options?.form.setError(field as any, {
						type: "server",
						message: message as string,
					});
				}
			}

			handleNavigate(errorData?.code);

			const error = new Error(
				errorData.message || `Request failed with status ${res.status}`,
			) as Error & {
				status: number;
				data: TError;
			};

			error.status = res.status;
			error.data = errorData;

			throw error;
		},
		...options,
	};
};

export const useAPIQuery = <
	T extends object & { $url: () => URL | { toString: () => string } },
	M extends AvailableMethodKeys<T>,
	Params extends EndpointMethodParams<T, M>,
	Options extends Omit<
		UseQueryOptions<
			TResponse,
			TError,
			InferSelectReturnType<TResponse, TError>,
			APIQueryKey<T, M, Params>
		>,
		"queryKey" | "queryFn"
	>,
	TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
	TError = EndpointResponseType<T, M, ErrorStatusCode>,
>(
	endpoint: T,
	method: M,
	params: Params,
	options?: Options,
): UseQueryResult<
	InferSelectReturnType<TResponse, Options["select"]>,
	TError
> => {
	const q = useRQQuery(
		apiQueryOptions<T, M, Params, Options, TResponse, TError>(
			endpoint,
			method,
			params,
			options,
		),
	);

	return q;
};

export const useAPISuspenseQuery = <
	T extends object & { $url: () => URL | { toString: () => string } },
	M extends AvailableMethodKeys<T>,
	Params extends EndpointMethodParams<T, M>,
	Options extends Omit<
		UseSuspenseQueryOptions<
			TResponse,
			TError,
			InferSelectReturnType<TResponse, TError>,
			APIQueryKey<T, M, Params>
		>,
		"queryKey" | "queryFn"
	>,
	TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
	TError = EndpointResponseType<T, M, ErrorStatusCode>,
>(
	endpoint: T & { $url: () => URL | { toString: () => string } },
	method: M,
	params: Params,
	options?: Options,
): UseSuspenseQueryResult<
	InferSelectReturnType<TResponse, Options["select"]>,
	TError
> => {
	const q = useRQSuspenseQuery(
		apiQueryOptions<T, M, Params, Options, TResponse, TError>(
			endpoint,
			method,
			params,
			options,
		),
	);

	return q;
};

export const useAPIMutation = <
	T extends object,
	M extends AvailableMethodKeys<T>,
	TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
	TError = EndpointResponseType<T, M, ErrorStatusCode>,
	TVariables = EndpointMethodParams<T, M>,
	TContext = unknown,
>(
	endpoint: T & { $url: () => URL | { toString: () => string } },
	method: M,
	options?: Omit<
		UseMutationOptions<TResponse, TError, TVariables, TContext>,
		"mutationFn" | "mutationKey"
	> & { form?: UseFormReturn<any> },
): UseMutationResult<TResponse, TError, TVariables, TContext> => {
	const q = useRQMutation(
		apiMutationOptions<T, M, TResponse, TError, TVariables, TContext>(
			endpoint,
			method,
			options,
		),
	);

	return q;
};

// Usage
// const data = useAPIQuery(
//   apiClient.posts,
//   "$get",
//   { query: { filter: "active" } },
//   { staleTime: 60000 }
// );

// const data =useAPIQuery(
// apiQueryOptions(
//   client.posts,
//   "$get",
//   { query: { filter: "active" } },
//   { staleTime: 60000 }
// )
// );
// const data =useAPIQuery(
// apiQueryOptions(
//   client.posts,
//   "$post",
//   {  json: { name: "john" } }
// )
// );
