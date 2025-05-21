import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@lipy/web-ui/screens/auth/login";
export const Route = createFileRoute("/(auth)/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return <LoginScreen />;
}
