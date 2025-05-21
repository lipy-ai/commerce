import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/account/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(loggedIn)/account/"!</div>;
}
