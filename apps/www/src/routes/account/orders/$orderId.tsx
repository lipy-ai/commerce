import { StatusBadge } from "@/components/order/myOrderCard";
import type { OrderStatus } from "@/components/order/orderTimeLine";
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
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	BanknoteArrowUp,
	Building,
	CircleUser,
	House,
	MapPin,
	MapPinHouse,
} from "lucide-react";

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

	console.log("Order Details Data:", data);

	return (
		<>
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
						<div className="col-span-8  lg:p-4 ">
							<div className="bg-white p-4">
								<div className="flex items-center justify-between">
									<h2 className="font-bold text-base ">{data[0]?.pk}</h2>
									<StatusBadge
										status={data[0]?.status as OrderStatus}
										size={20}
									/>
								</div>
								{data[0]?.deliveredAt ? (
									<p className="text-xs text-muted-foreground">
										Delivered on {format(new Date(data[0]?.deliveredAt), "Pp")}
									</p>
								) : data[0]?.cancelledAt ? (
									<p className="text-xs text-muted-foreground">
										Cancelled on {format(new Date(data[0]?.cancelledAt), "Pp")}
									</p>
								) : data[0]?.refundedAt ? (
									<p className="text-xs text-muted-foreground">
										Refunded on {format(new Date(data[0]?.refundedAt), "Pp")}
									</p>
								) : (
									<p className="text-xs text-muted-foreground">
										Ordered on {format(new Date(data[0]?.orderedAt), "Pp")}
									</p>
								)}
							</div>

							<div className="bg-white p-4 my-4 ">
								<div className="relative space-y-6">
									<div className="absolute left-5 top-10 w-0.5 h-10 border-l border-dashed border-foreground" />
									<div className="flex items-center gap-2 pr-2">
										<Avatar className="size-10">
											<AvatarImage
												src={data[0]?.logo || "https://picsum.photos/200"}
												alt=""
											/>
											<AvatarFallback className="rounded-lg bg-indigo-500 text-white">
												S
											</AvatarFallback>
										</Avatar>

										<div>
											<p className="font-medium line-clamp-1">
												{data[0]?.name || "Unknown Store"}
											</p>
											<p className="text-muted-foreground text-xs line-clamp-1">
												Paschim Vihar , Delhi
											</p>
										</div>
									</div>

									<div className=" flex items-center gap-2 ">
										<Avatar className="size-10">
											<AvatarFallback>
												{data[0]?.address?.tag === "home" ? (
													<House className="flex-shrink-0 size-5" />
												) : data[0]?.address?.tag === "work" ? (
													<Building className="  flex-shrink-0 size-5" />
												) : (
													<MapPinHouse className="size-5  flex-shrink-0 " />
												)}
											</AvatarFallback>
										</Avatar>

										<div>
											<p className="font-medium line-clamp-1">
												{data[0]?.address?.tag
													? data[0].address.tag.charAt(0).toUpperCase() +
														data[0].address.tag.slice(1)
													: "Other"}
											</p>
											<p className="text-muted-foreground text-xs line-clamp-1">
												{data[0]?.address?.line1 || "No address provided"}
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="p-4  bg-white">
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

						<div className="col-span-4 space-y-2  lg:p-4  ">
							<div className="space-y-4  p-4  my-4 bg-white ">
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
							<div className="p-4 my-4  bg-white space-y-4">
								{data[0]?.address?.name && data[0]?.address?.phone && (
									<div>
										<div className="flex items-start gap-4">
											<CircleUser className="text-muted-foreground flex-shrink-0" />
											<div>
												<p className="font-medium">Receiver's Info</p>
												<p className="text-muted-foreground text-sm">
													{data[0]?.address?.name} | {data[0]?.address?.phone}
												</p>
											</div>
										</div>
										<Separator className="border-t border-dashed bg-transparent  mt-3 -mb-3" />
									</div>
								)}

								<div>
									<div className="flex items-start gap-4">
										<BanknoteArrowUp className="text-muted-foreground flex-shrink-0" />
										<div>
											<p className="font-medium">Payment method</p>
											<p className="text-muted-foreground text-sm">
												{data[0]?.paymentMethod === "cod"
													? "Cash on Delivery"
													: "Unspecified"}
											</p>
										</div>
									</div>
									<Separator className="border-t border-dashed bg-transparent mt-3 -mb-3" />
								</div>

								<div className="flex items-start gap-4">
									<MapPin className="text-muted-foreground flex-shrink-0" />
									<div>
										<p className="font-medium">Delivery Address</p>
										<p className="text-muted-foreground text-sm">
											{data[0]?.address?.line1}
										</p>
									</div>
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
