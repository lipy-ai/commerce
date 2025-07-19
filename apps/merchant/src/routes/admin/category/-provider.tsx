import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { getAPIQueryKey } from "@lipy/lib/utils/useQueryClient";
import { useMutationState } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import {
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";
export type CategoryContext = {
	data: InferResponseType<typeof apiClient.v1.admin.category.$get> | undefined;
	isLoading: boolean;
	shouldPrompt: boolean;
	setShouldPrompt: (v: boolean) => void;
};

const Context = createContext<CategoryContext>({} as any);

export const CategoryProvider = ({
	children,
	query,
}: {
	children: ReactNode;
	query?: InferRequestType<typeof apiClient.v1.admin.category.$get>["query"];
}) => {
	const [shouldPrompt, setShouldPrompt] = useState(false);

	const q = useAPIQuery(
		apiClient.v1.admin.category,
		"$get",
		{
			query: query!,
		},
		{ enabled: !!query },
	);

	const deleteVars = useMutationState({
		filters: {
			mutationKey: getAPIQueryKey(apiClient.v1.admin.category, "$delete"),
			status: "pending",
		},
		select: (mutation) =>
			mutation.state.variables as InferRequestType<
				typeof apiClient.v1.admin.category.$delete
			>,
	});

	const updateVars = useMutationState({
		filters: {
			mutationKey: getAPIQueryKey(apiClient.v1.admin.category, "$patch"),
			status: "pending",
		},
		select: (mutation) =>
			mutation.state.variables as InferRequestType<
				typeof apiClient.v1.admin.category.$patch
			>,
	});

	const createVars = useMutationState({
		filters: {
			mutationKey: getAPIQueryKey(apiClient.v1.admin.category, "$post"),
			status: "success",
		},
		select: (mutation) =>
			mutation.state.data as InferResponseType<
				typeof apiClient.v1.admin.category.$post
			>,
	});

	const data = useMemo(() => {
		if (!q?.data?.items) return q.data;

		let result: NonNullable<typeof q.data>["items"] = [...q.data.items];

		if (deleteVars.length > 0) {
			const toDeleteIds = new Set(deleteVars.map((v) => v.json.ids[0]));
			result = result.filter((item) => !toDeleteIds.has(item.id));
		}

		if (createVars.length > 0) {
			result = [...createVars, ...result];
		}

		if (updateVars.length > 0) {
			const patchMap = new Map(updateVars.map((v) => [v.json.id, v.json]));

			result = result.map((item) => {
				if (patchMap.has(item.id)) {
					return {
						...item,
						...patchMap.get(item.id),
					};
				}
				return item;
			});
		}
		q.data.items = result;
		return q.data;
	}, [q.data, deleteVars, updateVars, createVars]);

	return (
		<Context.Provider
			value={{
				data,
				isLoading: q.isLoading,
				setShouldPrompt,
				shouldPrompt,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useCategory = () => useContext(Context);
