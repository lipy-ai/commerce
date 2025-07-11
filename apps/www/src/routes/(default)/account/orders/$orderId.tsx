import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import type { ORDER_STATUS } from "@lipy/server/db/schema";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";

import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import Loading from "@lipy/web-ui/components/ui/loading";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	BanknoteArrowUp,
	CircleUser,
	MapPin,
	MessageSquareText,
	Phone,
	Store,
} from "lucide-react";
import { ORDER_STATUS_BADGE_VARIANT } from ".";

export const Route = createFileRoute("/(default)/account/orders/$orderId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { orderId } = Route.useParams();

	const { data: order, isLoading } = useAPIQuery(
		apiClient.v1.order[":id"],
		"$get",
		{
			param: {
				id: orderId,
			},
		},
		{
			placeholderData: (p) => p,
		},
	);

	const totalPrice = order?.itemTotalAmount ?? 0;
	const deliveryCharges = 0;
	const totalTaxAmount = order?.totalTaxAmount ?? 0;
	const totalPayableAmount = totalPrice + deliveryCharges + totalTaxAmount;

	const infos = [
		{
			title: "Receiver's Info",
			icon: CircleUser,
			value: [
				order?.customerDetails?.address?.name,
				order?.customerDetails?.address?.phone,
			]
				.filter(Boolean)
				.join(" | "),
		},
		{
			title: "Delivery Address",
			icon: MapPin,
			value: [
				order?.customerDetails?.address?.metadata?.building,
				order?.customerDetails?.address?.line1,
			]
				.filter(Boolean)
				.join(", "),
		},
		{
			title: "Payment Method",
			icon: BanknoteArrowUp,
			value:
				order?.paymentMethod === "cod" ? "Cash on Delivery" : "Unspecified",
		},
		{
			title: "Delivery Instruction",
			icon: MessageSquareText,
			value: order?.customerInstructions?.delivery,
		},
	];

	return (
		<>
			{isLoading ? (
				<Loading hideDefault />
			) : !order ? (
				<EmptyPage
					title={"Order not found"}
					label="The order you are looking for does not exist or has been deleted."
				/>
			) : (
				<div className="w-full">
					<DashboardHeader
						titleChildren={
							<div>
								<p className="font-semibold">Order Details</p>
								<p className="text-muted-foreground text-xs">
									{order?.items?.length || 0} item(s) |{" "}
									{formatAmount(order.currency, totalPrice || 0)}{" "}
								</p>
							</div>
						}
					>
						<Badge
							variant={
								ORDER_STATUS_BADGE_VARIANT[
									order.status as (typeof ORDER_STATUS)[number]
								] || "neutral"
							}
							className="capitalize"
							size="spacious"
						>
							{order.status || "Unknown"}
						</Badge>
					</DashboardHeader>

					<div className="lg:grid lg:grid-cols-12 divide-x flex-1">
						<div className="col-span-7 p-4 space-y-4">
							<Card>
								<CardHeader className="flex items-center justify-between gap-4 border-b -mx-4 px-4">
									<Link
										className="flex items-center gap-2"
										to="/$storeHandle"
										params={{
											storeHandle: order.storeHandle ?? "",
										}}
									>
										<Avatar>
											<AvatarImage src={order.storeLogo || ""} />
											<AvatarFallback>
												<Store />
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium text-base">{order.storeName}</p>
											<p className="text-muted-foreground line-clamp-1">
												{order.storeAddress?.line1 || ""}
											</p>
										</div>
									</Link>

									<a
										href={`tel:${order?.storePhone}`}
										className={cn(
											buttonVariants({ variant: "outline", size: "icon" }),
											"rounded-full",
										)}
									>
										<Phone className="text-ring size-5" />
									</a>
								</CardHeader>
								<CardContent>
									<p className="font-medium text-base">Order ID : {order.id}</p>

									{order.deliveredAt ? (
										<p className="text-muted-foreground text-sm">
											Delivered on {format(new Date(order?.deliveredAt), "PPp")}
										</p>
									) : order?.cancelledAt ? (
										<p className="text-muted-foreground text-sm">
											Cancelled on {format(new Date(order?.cancelledAt), "PPp")}
										</p>
									) : order?.refundedAt ? (
										<p className="text-muted-foreground text-sm">
											Refunded on {format(new Date(order?.refundedAt), "PPp")}
										</p>
									) : (
										<p className="text-muted-foreground text-sm">
											Ordered on {format(new Date(order?.orderedAt), "PPp")}
										</p>
									)}
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Item(s) ordered</CardTitle>
								</CardHeader>
								<CardContent>
									{order?.items?.map((product, i) => (
										<div key={i} className="flex gap-2 items-center py-2">
											<Link
												to="/$storeHandle/products/$productId"
												params={{
													storeHandle: order?.storeHandle ?? "",
													productId: product?.id ?? "",
												}}
											>
												<img
													src={product.thumbnail || "https://picsum.photos/200"}
													alt=""
													className="size-12 border rounded bg-accent"
												/>
											</Link>

											<div className="flex-1">
												<h2 className="leading-4 line-clamp-2">
													{product.title}
												</h2>
												<p className="text-muted-foreground text-xs">
													{product.variant.unit}
												</p>
											</div>
											<div className="text-right">
												<p className="font-medium">
													{formatAmount(
														order.currency,
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
										<p>Item Total ({order.items?.length ?? 0})</p>
										<p className="font-medium">
											{formatAmount(order?.currency, totalPrice || 0)}
										</p>
									</div>
									<div className="flex justify-between text-sm">
										<p>Delivery Charges</p>
										<p className="font-medium">
											{formatAmount(order?.currency, deliveryCharges)}
										</p>
									</div>
									<div className="flex justify-between text-sm">
										<p>Taxes</p>
										<p className="font-medium">
											{formatAmount(order?.currency, totalTaxAmount)}
										</p>
									</div>
								</CardContent>
								<CardFooter className="flex justify-between items-center border-t border-dashed">
									<p className="font-semibold text-base">Total Payable</p>
									<p className="font-semibold text-xl">
										{formatAmount(order?.currency, totalPayableAmount)}
									</p>
								</CardFooter>
							</Card>
							<div className="divide-y divide-dashed bg-card rounded-xl mb-20">
								{infos.map((info) => {
									if (!info.value) return;
									return (
										<div
											key={info?.title}
											className="flex items-start gap-2 p-4"
										>
											<info.icon className="text-muted-foreground flex-shrink-0 size-6" />
											<div>
												<p className="font-medium ">{info.title}</p>
												<p className="text-muted-foreground text-xs">
													{info.value}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
