import { authClient } from "@lipy/lib/providers/auth";
import { createFileRoute } from "@tanstack/react-router";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)/logout")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	useEffect(() => {
		authClient.signOut().then((_e) => navigate({ to: "/", replace: true }));
	}, []);
	return <Loading title="Logging out..." />;
}
