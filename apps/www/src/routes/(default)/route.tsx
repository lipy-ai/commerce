import NavBar from "@/components/navBar";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Outlet, createFileRoute } from "@tanstack/react-router";

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
