import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "./-account";

export const Route = createFileRoute("/(default)/account/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountPage />;
}
