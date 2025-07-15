import NavBar from "@/components/navBar";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(default)")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();
	return (
		<>
			{!isMobile && <NavBar />}
			<Outlet />
		</>
	);
}
