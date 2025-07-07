import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Badge } from "@lipy/web-ui/components/ui/badge";

import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { BanknoteArrowUp, CircleUser, MapPin } from "lucide-react";

export const Route = createFileRoute("/(default)/account/orders/$orderId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { orderId }: any = Route.useParams();

	const { data, isFetched, isFetching } = useAPIQuery(
		apiClient.v1.order[":id"],
		"$get",
		{
			param: {
				id: orderId,
			},
		},
	);

	const totalPrice = data?.[0]?.itemTotalAmount ?? 0;
	const deliveryCharges = 0;
	const totalTaxAmount = data?.[0]?.totalTaxAmount ?? 0;
	const totalPayableAmount = totalPrice + deliveryCharges + totalTaxAmount;

	return (
		<>
			{isFetching && <Spinner />}
			{isFetched && data && (
				<div className="min-h-screen flex flex-col">
					<DashboardHeader
						titleChildren={
							<div>
								<p className="font-semibold">Order Details</p>
								<p className="text-muted-foreground text-xs">
									{data[0]?.items?.length ?? 0} items |{" "}
									{formatAmount(data[0]?.currency, totalPrice || 0)}{" "}
								</p>
							</div>
						}
					>
						{data?.[0]?.status === "delivered" && (
							<Button size={"sm"}>REORDER</Button>
						)}
					</DashboardHeader>

					<div className="lg:grid lg:grid-cols-12 divide-x flex-1">
						<div className="col-span-7 p-4 space-y-4">
							<div className="bg-card rounded-xl p-2">
								<div className="flex items-center justify-between">
									<h2 className="font-bold text-base">{data[0]?.id}</h2>
									<Badge
										variant={
											data[0]?.status === "delivered" ? "success" : "premium"
										}
									>
										{data[0]?.status
											? data[0]?.status.charAt(0).toUpperCase() +
												data[0]?.status.slice(1)
											: "Unknown"}
									</Badge>
								</div>
								{data[0]?.deliveredAt ? (
									<p className="text-muted-foreground text-sm">
										Delivered on {format(new Date(data[0]?.deliveredAt), "Pp")}
									</p>
								) : data[0]?.cancelledAt ? (
									<p className="text-muted-foreground text-sm">
										Cancelled on {format(new Date(data[0]?.cancelledAt), "Pp")}
									</p>
								) : data[0]?.refundedAt ? (
									<p className="text-muted-foreground text-sm">
										Refunded on {format(new Date(data[0]?.refundedAt), "Pp")}
									</p>
								) : (
									<p className="text-muted-foreground text-sm">
										Ordered on {format(new Date(data[0]?.orderedAt), "Pp")}
									</p>
								)}
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Item(s) ordered</CardTitle>
								</CardHeader>
								<CardContent>
									{data[0]?.items?.map((product, i) => (
										<div key={i} className="flex gap-2 items-center py-2">
											<img
												src={product.thumbnail || "https://picsum.photos/200"}
												alt=""
												className="size-14 border rounded bg-accent"
											/>

											<div className="flex-1">
												<h2 className="text-sm ">{product.title}</h2>
												<p className="text-muted-foreground text-sm">
													{product.variant.unit}
												</p>
											</div>
											<div className="text-right">
												<p className="font-medium">
													{formatAmount(
														data[0]?.currency,
														product.variant.price || 0,
													)}
												</p>
												<p className="text-sm text-muted-foreground">
													Qty {product.quantity || 0}
												</p>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						</div>

						<div className="col-span-5 space-y-4 p-4 -mt-4">
							<Card>
								<CardHeader>
									<CardTitle>Bill Summary</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between text-sm">
										<p>Item Total ({data[0]?.items?.length ?? 0})</p>
										<p className="font-medium">
											{formatAmount(data[0]?.currency, totalPrice || 0)}
										</p>
									</div>
									<div className="flex justify-between text-sm">
										<p>Delivery Charges</p>
										<p className="font-medium">
											{formatAmount(data[0]?.currency, deliveryCharges)}
										</p>
									</div>
									<div className="flex justify-between text-sm">
										<p>Taxes</p>
										<p className="font-medium">
											{formatAmount(data[0]?.currency, totalTaxAmount)}
										</p>
									</div>
								</CardContent>
								<CardFooter className="flex justify-between items-center border-t border-dashed">
									<p className="font-semibold text-base">Total Payable</p>
									<p className="font-semibold text-xl">
										{formatAmount(data[0]?.currency, totalPayableAmount)}
									</p>
								</CardFooter>
							</Card>
							<div className="divide-y divide-dashed bg-card rounded-xl">
								{data[0]?.customerDetails?.address?.name && (
									<div>
										<div className="flex items-start gap-4 p-2">
											<CircleUser className="text-muted-foreground flex-shrink-0 mt-1" />
											<div>
												<p className="font-medium text-base">Receiver's Info</p>
												<p className="text-muted-foreground">
													{[
														data[0]?.customerDetails?.address?.name,
														data[0]?.customerDetails.address?.phone,
													]
														.filter(Boolean)
														.join(" | ")}
												</p>
											</div>
										</div>
									</div>
								)}

								<div>
									<div className="flex items-start gap-4 p-2">
										<BanknoteArrowUp className="text-muted-foreground flex-shrink-0" />
										<div>
											<p className="font-medium text-base">Payment method</p>
											<p className="text-muted-foreground">
												{data[0]?.paymentMethod === "cod"
													? "Cash on Delivery"
													: "Unspecified"}
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-start gap-4 p-2">
									<MapPin className="text-muted-foreground flex-shrink-0 mt-1" />
									<div>
										<p className="font-medium text-base">Delivery Address</p>
										<p className="text-muted-foreground">
											{[
												data[0]?.customerDetails?.address?.metadata?.building,
												data[0]?.customerDetails?.address?.line1,
											]
												.filter(Boolean)
												.join(", ")}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
