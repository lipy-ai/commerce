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
import { Card, CardContent, CardHeader } from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { Link, createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Store } from "lucide-react";

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
		<div className="[view-transition-name:main-content]">
			<DashboardHeader title="My Orders" />

			{isFetched &&
				data &&
				data.length > 0 &&
				(() => {
					let lastMonth = "";

					return (
						<div className="mb-20 p-4 space-y-2">
							{data.map((order) => {
								const currentMonth = format(order.orderedAt, "LLLL yyyy");
								const showMonth = currentMonth !== lastMonth;
								lastMonth = currentMonth;

								return (
									<div key={order.id}>
										{showMonth && (
											<h2 className="text-sm font-semibold py-2">
												{currentMonth}
											</h2>
										)}

										<Card className="p-0 gap-0  border border-border/40">
											<CardHeader className="flex items-start justify-between gap-4 border-b p-2 ">
												<Link
													className="flex items-center gap-2"
													to="/$storeHandle"
													params={{
														storeHandle: order?.storeHandle as string,
													}}
												>
													<Avatar className="rounded-md size-8">
														<AvatarImage src={order?.store.image || ""} />
														<AvatarFallback>
															<Store />
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="font-medium text-sm line-clamp-1">
															{order?.store?.name || "Unknown store"}
														</p>
														<p className="text-xs text-muted-foreground line-clamp-1">
															{order?.store?.address?.line1 ||
																"Mumbai, Maharashtra"}
														</p>
													</div>
												</Link>
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
											</CardHeader>

											<CardContent className="p-2">
												<Link
													to="/account/orders/$orderId"
													params={{ orderId: order.id as string }}
													className="space-y-2"
													viewTransition={{ types: ["slide-left"] }}
												>
													<p className="text-xs">
														{order?.items
															?.map(
																(item) => `${item.title} (${item.quantity})`,
															)
															.join(", ")}
													</p>

													<div className="flex items-center justify-between">
														<p className="text-muted-foreground text-xs">
															Ordered on {format(order?.orderedAt, "d LLL, p")}
														</p>
														<p className="font-bold text-base">
															{formatAmount(
																order?.currency,
																order?.itemTotalAmount as number,
															)}
														</p>
													</div>
												</Link>
											</CardContent>
										</Card>
									</div>
								);
							})}
						</div>
					);
				})()}

			{isFetching &&
				[...Array(5)].map((_, i) => (
					<div key={i} className="flex flex-col items-center my-2">
						<Skeleton className="h-32 w-full " />
					</div>
				))}

			{isFetched && data?.length === 0 && (
				<EmptyPage
					title={"You have no order records"}
					label="Place order to start"
				/>
			)}
		</div>
	);
}
