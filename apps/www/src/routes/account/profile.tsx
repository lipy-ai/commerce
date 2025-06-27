import UserProfile from "@lipy/web-ui/components/pages/profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return <UserProfile />;
}
