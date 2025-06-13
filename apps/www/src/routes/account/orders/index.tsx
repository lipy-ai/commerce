import { MyOrderCard } from "@/components/order/myOrderCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";

export const Route = createFileRoute("/account/orders/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isFetched, isFetching } = useAPIQuery(
		apiClient.v1.order,
		"$get",
		{
			query: {
				view: "all",
			},
		},
	);

	return (
		<>
			<DashboardHeader title="My Orders" />

			<div className="my-4 space-y-2 max-w-screen-lg m-auto ">
				{isFetched &&
					data &&
					data.length > 0 &&
					(() => {
						let lastMonth = "";

						return data.map((order) => {
							const currentMonth = format(order.orderedAt, "LLLL yyyy");
							const showMonth = currentMonth !== lastMonth;
							lastMonth = currentMonth;

							return (
								<div key={order.id} className="px-4 py-2">
									{showMonth && (
										<h2 className="text-sm font-semibold mb-4">
											{currentMonth}
										</h2>
									)}

									<MyOrderCard order={order} />
								</div>
							);
						});
					})()}

				{isFetching && !data && (
					<Spinner className="absolute top-1/2 left-1/2" />
				)}
			</div>

			{isFetched && data?.length === 0 && (
				<EmptyPage
					title={"You have no order records"}
					label="Place order to start"
				/>
			)}
		</>
	);
}
