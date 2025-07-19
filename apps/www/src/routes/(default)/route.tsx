import NavBar from "@/components/navBar";

import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import LocationComponent from "./account/addresses/-deliveryAddressAlert";

export const Route = createFileRoute("/(default)")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();
	const { deliveryLocation, hasHydrated } = useLocationStore();

	return (
		<>
			{!isMobile && <NavBar />}
			{hasHydrated && deliveryLocation.line1 === "" && <LocationComponent />}

			<Outlet />
		</>
	);
}
