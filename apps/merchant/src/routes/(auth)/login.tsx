import { LoginScreen } from "@lipy/web-ui/screens/auth/login";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/(auth)/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return <LoginScreen />;
}
