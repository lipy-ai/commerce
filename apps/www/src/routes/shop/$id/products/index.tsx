import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shop/$id/products/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/shop/$id/products/"!</div>;
}
