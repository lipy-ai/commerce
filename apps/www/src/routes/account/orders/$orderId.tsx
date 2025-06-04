import {
	type OrderStatus,
	OrderStatusTimeline,
} from "@/components/order/orderTimeLine";
import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { BanknoteArrowUp, CircleUser, MapPin } from "lucide-react";

export const Route = createFileRoute("/account/orders/$orderId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { orderId } = Route.useParams();

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
			{isFetched && data && (
				<div className="min-h-screen flex flex-col">
					<DashboardHeader
						titleChildren={
							<div>
								<p className="font-semibold">ORDER #{data[0].pk}</p>
								<p className="text-muted-foreground text-xs">
									{data[0]?.items?.length ?? 0} items |{" "}
									{formatAmount(data[0]?.currency, totalPrice || 0)}{" "}
								</p>
							</div>
						}
					>
						<Button size={"sm"}>REORDER</Button>
					</DashboardHeader>
					<div className="lg:grid lg:grid-cols-12 divide-x flex-1">
						<div className="col-span-8 divide-y lg:p-4">
							<div className="p-4 ">
								<h2 className="text-lg font-semibold">Order status</h2>
								<OrderStatusTimeline
									currentStatus={data[0]?.status as OrderStatus}
								/>
							</div>

							<div className="p-4 border rounded-md m-2 bg-white">
								<h2 className="text-lg font-semibold">Item(s) ordered</h2>
								{data[0]?.items?.map((product, i) => (
									<div key={i} className="flex gap-2 items-center p-4">
										<img
											src={product.thumbnail || "https://picsum.photos/200"}
											alt=""
											className="size-12 border rounded bg-accent"
										/>
										<div className="flex-1">
											<h2 className="font-semibold">
												{product.variant.title || product.title}
											</h2>
											<p className="text-sm text-muted-foreground">
												Color Blue, 5kg
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
												{product.quantity || 0}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="col-span-4 space-y-2  lg:p-4 divide-y ">
							<div className="space-y-4 p-4 rounded-md m-2 border bg-white">
								<h2 className="text-lg font-semibold">Bill Summary</h2>
								<div className="space-y-4">
									<div className="flex justify-between">
										<p>Item Total ({data[0]?.items?.length ?? 0})</p>
										<p className="font-medium">
											{formatAmount(data[0]?.currency, totalPrice || 0)}
										</p>
									</div>
									<div className="flex justify-between">
										<p>Delivery Charges</p>
										<p className="font-medium">
											{formatAmount(data[0]?.currency, deliveryCharges)}
										</p>
									</div>
									<div className="flex justify-between">
										<p>Taxes</p>
										<p className="font-medium">
											{formatAmount(data[0]?.currency, totalTaxAmount)}
										</p>
									</div>
									<Separator className="border-t border-dashed bg-transparent my-2" />
									<div className="flex justify-between items-center ">
										<p className="font-semibold text-md">Total Payable</p>
										<p className="font-semibold text-xl">
											{formatAmount(data[0]?.currency, totalPayableAmount)}
										</p>
									</div>
								</div>
							</div>
							<div className="p-4 space-y-4 border rounded-md m-2 bg-white">
								{data[0]?.address?.name && data[0]?.address?.phone && (
									<div>
										<div className="flex items-start gap-4">
											<CircleUser className="text-muted-foreground " />
											<div>
												<p className="font-medium">Contact Info</p>
												<p className="text-muted-foreground text-sm">
													{data[0]?.address?.name} | {data[0]?.address?.phone}
												</p>
											</div>
										</div>
										<Separator className="border-t border-dashed bg-transparent my-2" />
									</div>
								)}

								<div className="flex items-start gap-4">
									<BanknoteArrowUp className="text-muted-foreground" />
									<div>
										<p className="font-medium">Payment method</p>
										<p className="text-muted-foreground text-sm">
											{data[0]?.paymentMethod === "cod"
												? "Cash on Delivery"
												: "Unspecified"}
										</p>
									</div>
								</div>
								<Separator className="border-t border-dashed bg-transparent my-2" />
								<div className="flex items-start gap-4">
									<MapPin className="text-muted-foreground" />
									<div>
										<p className="font-medium">Delivery Address</p>
										<p className="text-muted-foreground text-sm">
											{data[0]?.address?.line1}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4 p-4">
								<Label>Delivery Partner</Label>

								<div className="space-y-4">
									<div className="flex gap-2">
										<Avatar className="size-12">
											<AvatarImage src="https://picsum.photos/200" alt="" />
											<AvatarFallback>A</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">Kundan Bhosale</p>
											<p className="text-sm">+91 3567866754</p>
										</div>
									</div>
									<p className="font-light text-sm">
										Delivery partner was assigned on 12 Feb 2025
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{isFetching && !data && <Spinner className="absolute left-1/2 top-1/2" />}
		</>
	);
}
