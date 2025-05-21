import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/")({
	component: RouteComponent,
	loader: () => {
		return redirect({ to: "/demo/client", throw: true });
	},
});

function RouteComponent() {
	return null;
}
