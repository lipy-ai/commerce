import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import type { ORDER_STATUS } from "@lipy/server/db/schema";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge, type badgeVariants } from "@lipy/web-ui/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@lipy/web-ui/components/ui/card";
import Loading from "@lipy/web-ui/components/ui/loading";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { Package2, Paperclip, Store } from "lucide-react";

export const Route = createFileRoute("/(default)/account/orders/")({
	component: RouteComponent,
});

export const ORDER_STATUS_BADGE_VARIANT: Record<
	(typeof ORDER_STATUS)[number],
	VariantProps<typeof badgeVariants>["variant"]
> = {
	ordered: "info",
	accepted: "accent",
	packed: "accent",
	out_for_delivery: "warning",
	delivered: "success",
	return_requested: "warning",
	refunded: "destructive",
	replaced: "brand",
	cancelled: "destructive",
};

function RouteComponent() {
	const { data, isLoading } = useAPIQuery(
		apiClient.v1.order,
		"$get",
		{
			query: {
				view: "all",
			},
		},
		{
			placeholderData: (p) => p,
		},
	);

	return (
		<>
			<DashboardHeader title="My Orders" />
			{isLoading ? (
				<Loading />
			) : !data || data.length === 0 ? (
				<EmptyPage
					title={"You have no orders yet"}
					label="Place an order to start"
					icon={Package2}
				/>
			) : (
				<div>
					<div className="p-4 space-y-4 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
						{(() => {
							let lastMonth = "";
							return data.map((order) => {
								const currentMonth = format(order.orderedAt, "LLLL yyyy");
								const showMonth = currentMonth !== lastMonth;
								lastMonth = currentMonth;

								return (
									<div key={order.id}>
										{showMonth && (
											<h2 className="text-sm font-semibold py-2 lg:hidden">
												{currentMonth}
											</h2>
										)}

										<Card className="border border-border/40 lg:border-border ">
											<CardHeader className="flex items-start justify-between gap-4 border-b ">
												<Link
													className="flex items-center gap-2"
													to="/$storeHandle"
													params={{
														storeHandle: order?.storeHandle as string,
													}}
												>
													<Avatar className="rounded-md size-10 ">
														<AvatarImage src={order?.store.image || ""} />
														<AvatarFallback>
															<Store />
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="font-medium  line-clamp-1">
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
														ORDER_STATUS_BADGE_VARIANT[
															order.status as (typeof ORDER_STATUS)[number]
														] || "neutral"
													}
													className="capitalize"
												>
													{order.status || "Unknown"}
												</Badge>
											</CardHeader>

											<Link
												to="/account/orders/$orderId"
												params={{ orderId: order.id as string }}
												className="space-y-2"
											>
												<CardContent>
													<div className="grid grid-cols-5 gap-y-1.5">
														{order?.items?.map((item) => (
															<img
																key={item.variant.inventoryId}
																src={item.thumbnail || ""}
																className="aspect-square object-cover size-12 rounded-sm border border-border/40 bg-accent/40"
																alt={""}
															/>
														))}
														{order?.customerInstructions?.attachments?.map(
															(item, index) => (
																<img
																	key={index}
																	src={item || ""}
																	className="aspect-square object-cover size-12 rounded-sm border border-border/40 bg-accent/40"
																	alt={""}
																/>
															),
														)}
													</div>
													{order?.customerInstructions?.attachments &&
														order?.customerInstructions?.attachments?.length >
															0 && (
															<div className="inline-flex items-center gap-2 text-muted-foreground pt-2">
																<Paperclip className="size-4" />
																{
																	order?.customerInstructions?.attachments
																		?.length
																}{" "}
																attachments
															</div>
														)}
												</CardContent>
												<CardFooter className="flex items-center justify-between border-t border-dashed">
													<p className="text-muted-foreground text-sm">
														Ordered on {format(order?.orderedAt, "d LLL, p")}
													</p>
													<p className="font-bold text-base">
														{formatAmount(
															order?.currency,
															order?.itemTotalAmount as number,
														)}
													</p>
												</CardFooter>
											</Link>
										</Card>
									</div>
								);
							});
						})()}
					</div>
				</div>
			)}
		</>
	);
}
