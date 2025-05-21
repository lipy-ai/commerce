import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/(categories)/categories")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(loggedIn)/(categories)/categories"!</div>;
}
