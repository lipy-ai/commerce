import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import GoogleMapImage from "@lipy/web-ui/components/maps/googleMap";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/account/addresses/new")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			type: search.type as "deliveryAddress" | "saveAddress" | undefined,
		};
	},
});

function RouteComponent() {
	const { type } = Route.useSearch();

	return (
		<>
			<DashboardHeader
				title={type === "deliveryAddress" ? "Delivery Address" : "New Address"}
			/>

			<GoogleMapImage type={type} />
		</>
	);
}
