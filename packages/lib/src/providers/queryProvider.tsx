"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";

// NEVER DO THIS:
// const queryClient = new QueryClient()
//
// Creating the queryClient at the file root level makes the cache shared
// between all requests and means _all_ data gets passed to _all_ users.
// Besides being bad for performance, this also leaks any sensitive data.

export default function QueryProvider({
	children,
	handleThrowOnError,
}: {
	children: ReactNode;
	handleThrowOnError: (v: Error) => boolean;
}) {
	// Instead do this, which ensures each request has its own cache:
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						networkMode: "offlineFirst",
						// With SSR, we usually want to set some default staleTime
						// above 0 to avoid refetching immediately on the client
						staleTime: 60 * 1000,
						retry: 3,
					},
					mutations: {
						networkMode: "offlineFirst",
						onError: handleThrowOnError,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
