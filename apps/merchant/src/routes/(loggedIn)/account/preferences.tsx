import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/account/preferences")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>preferences</div>;
}
