import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/product/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(loggedIn)/product/create"!</div>;
}
