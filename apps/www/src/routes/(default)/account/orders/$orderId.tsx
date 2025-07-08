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

import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
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

	const infos = [
		{
			title: "Receiver's Info",
			icon: CircleUser,
			value: [
				data?.[0]?.customerDetails?.address?.name,
				data?.[0]?.customerDetails?.address?.phone,
			]
				.filter(Boolean)
				.join(" | "),
		},
		{
			title: "Delivery Address",
			icon: MapPin,
			value: [
				data?.[0]?.customerDetails?.address?.metadata?.building,
				data?.[0]?.customerDetails?.address?.line1,
			]
				.filter(Boolean)
				.join(", "),
		},
		{
			title: "Payment Method",
			icon: BanknoteArrowUp,
			value:
				data?.[0]?.paymentMethod === "cod" ? "Cash on Delivery" : "Unspecified",
		},
		{
			title: "Delivery Instruction",
			icon: MessageSquareText,
			value: data?.[0]?.customerInstructions?.delivery,
		},
	];

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
						<Badge
							variant={
								ORDER_STATUS_BADGE_VARIANT[
									data[0]?.status as (typeof ORDER_STATUS)[number]
								] || "neutral"
							}
							className="capitalize"
						>
							{data[0]?.status || "Unknown"}
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
											storeHandle: data[0]?.storeHandle ?? "",
										}}
									>
										<Avatar>
											<AvatarImage src={data[0]?.storeLogo || ""} />
											<AvatarFallback>
												<Store />
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium text-base">
												{data[0]?.storeName}
											</p>
											<p className="text-muted-foreground line-clamp-1">
												{data[0]?.storeAddress?.line1 || ""}
											</p>
										</div>
									</Link>

									<Button
										variant="outline"
										size="icon"
										className="rounded-full"
										onClick={() => {
											window.open(`tel:${data[0]?.storePhone}`);
										}}
									>
										<Phone className="text-ring size-5" />
									</Button>
								</CardHeader>
								<CardContent>
									<p className="font-medium text-base">
										Order ID : {data[0]?.id}
									</p>

									{data[0]?.deliveredAt ? (
										<p className="text-muted-foreground text-sm">
											Delivered on{" "}
											{format(new Date(data[0]?.deliveredAt), "PPp")}
										</p>
									) : data[0]?.cancelledAt ? (
										<p className="text-muted-foreground text-sm">
											Cancelled on{" "}
											{format(new Date(data[0]?.cancelledAt), "PPp")}
										</p>
									) : data[0]?.refundedAt ? (
										<p className="text-muted-foreground text-sm">
											Refunded on {format(new Date(data[0]?.refundedAt), "PPp")}
										</p>
									) : (
										<p className="text-muted-foreground text-sm">
											Ordered on {format(new Date(data[0]?.orderedAt), "PPp")}
										</p>
									)}
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Item(s) ordered</CardTitle>
								</CardHeader>
								<CardContent>
									{data[0]?.items?.map((product, i) => (
										<div key={i} className="flex gap-2 items-center py-2">
											<Link
												to="/$storeHandle/products/$productId"
												params={{
													storeHandle: data[0]?.storeHandle ?? "",
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
												<h2 className="text-sm leading-4">{product.title}</h2>
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
							<div className="divide-y divide-dashed bg-card rounded-xl mb-20">
								{infos.map((info) => {
									if (!info.value) return;
									return (
										<div
											key={info?.title}
											className="flex items-start gap-4 p-2"
										>
											<info.icon className="text-muted-foreground flex-shrink-0 mt-1" />
											<div>
												<p className="font-medium text-base">{info.title}</p>
												<p className="text-muted-foreground">{info.value}</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* <div className="fixed bottom-0 w-full bg-card shadow-md p-4 flex items-center justify-between gap-4">
						<Button variant="outline" className="flex-1 w-full">
							<Headset />
							Need help
						</Button>
						<Button className="flex-1 w-full">
							{data[0]?.status === "ordered" || data[0]?.status === "accepted"
								? "Cancel Order"
								: "Reorder"}
						</Button>
					</div> */}
				</div>
			)}
		</>
	);
}
