import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import {
	ErrorComponent,
	Link,
	rootRouteId,
	useMatch,
	useRouter,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: false,
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
		scrollRestoration: true,
		defaultViewTransition: true,
	});
	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	console.error("DefaultCatchBoundary Error:", error);
	// console.log(error instanceof Error);
	// console.log(error);

	return (
		<div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
			<ErrorComponent
				error={
					error instanceof Error
						? error
						: new Error((error as any)?.message || "Something went wrong", {
								cause: (error as any)?.data || null,
							})
				}
			/>
			<div className="flex gap-2 items-center flex-wrap">
				<button
					type="button"
					onClick={() => {
						router.invalidate();
					}}
					className={
						"px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
					}
				>
					Try Again
				</button>
				{isRoot ? (
					<Link
						to="/"
						className={
							"px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
						}
					>
						Home
					</Link>
				) : (
					<Link
						to="/"
						className={
							"px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
						}
						onClick={(e) => {
							e.preventDefault();
							window.history.back();
						}}
					>
						Go Back
					</Link>
				)}
			</div>
		</div>
	);
}

export function NotFound({ children }: { children?: any }) {
	return (
		<div className="space-y-2 p-2">
			<div className="text-gray-600 dark:text-gray-400">
				{children || <p>The page you are looking for does not exist.</p>}
			</div>
			<p className="flex items-center gap-2 flex-wrap">
				<button
					type="button"
					onClick={() => window.history.back()}
					className="bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm"
				>
					Go back
				</button>
				<Link
					to="/"
					className="bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm"
				>
					Start Over
				</Link>
			</p>
		</div>
	);
}
