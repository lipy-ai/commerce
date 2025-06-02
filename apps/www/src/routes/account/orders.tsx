import MyOrderCard from "@/components/order/myOrderCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/account/orders")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isFetched } = useAPIQuery(apiClient.v1.order, "$get", {
		query: {},
	});

	if (isFetched) {
		console.log(data);
	}
	return (
		<>
			<DashboardHeader title="My Orders" />
			{isFetched &&
				data &&
				data.length > 0 &&
				data.map((order) => (
					<div key={order.id} className="px-4 py-2">
						<MyOrderCard order={order} />
					</div>
				))}
		</>
	);
}
