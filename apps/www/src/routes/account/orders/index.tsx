import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { Link, createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { EllipsisVertical, Store } from "lucide-react";

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
			<div className="space-y-6 lg:space-y-10 mb-20">
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
								<div key={order.id}>
									{showMonth && (
										<h2 className="text-sm font-semibold m-4">
											{currentMonth}
										</h2>
									)}

									<div className="bg-card p-4">
										<div className="flex items-center justify-between gap-4">
											<Link
												className="flex items-center gap-2"
												to="/shop/$id"
												params={{ id: order.storeId as string }}
											>
												<Avatar className="rounded-md size-10">
													<AvatarImage src={order?.storeLogo || ""} />
													<AvatarFallback>
														<Store />
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium text-sm line-clamp-1">
														{order?.storeName || "Unknown store"}
													</p>
													<p className="text-muted-foreground line-clamp-1 text-xs">
														{order?.storeAddress?.line1 ||
															"Mumbai, Maharashtra"}
													</p>
												</div>
											</Link>

											<Button variant="ghost" size="icon-sm">
												<EllipsisVertical />
											</Button>
										</div>

										<Separator className="my-2" />

										<Link
											to="/account/orders/$orderId"
											params={{ orderId: order.orderPrimaryId as string }}
										>
											<p className="text-xs ">
												{order?.items
													?.map((item) => `${item.title} (${item.quantity})`)
													.join(", ")}
											</p>
											<div className="border border-dashed my-2" />
											<div className="flex items-center justify-between">
												<p className="text-muted-foreground text-xs">
													Ordered on {format(order?.orderedAt, "d LLL, p")}
												</p>
												<p className="font-semibold">
													{formatAmount(
														order?.currency,
														order?.itemTotalAmount as number,
													)}
												</p>
											</div>
										</Link>

										<Separator className="my-2" />
										<Badge
											variant={
												order.status === "delivered" ? "success" : "premium"
											}
										>
											{order?.status
												? order.status.charAt(0).toUpperCase() +
													order.status.slice(1)
												: "Unknown"}
										</Badge>
									</div>
								</div>
							);
						});
					})()}
			</div>
			{isFetching &&
				[...Array(5)].map((_, i) => (
					<div key={i} className="my-2 flex flex-col items-center">
						<Skeleton className="h-32 w-full " />
					</div>
				))}

			{isFetched && data?.length === 0 && (
				<EmptyPage
					title={"You have no order records"}
					label="Place order to start"
				/>
			)}
		</>
	);
}
