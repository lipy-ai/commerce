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
import { Label } from "@lipy/web-ui/components/ui/label";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";

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

	let totalPrice = 0;
	const deliveryCharges = 0;
	let totalTaxAmount = 0;
	let totalPayableAmount = 0;
	if (isFetched && data?.[0]?.items) {
		for (const item of data[0].items) {
			totalPrice += item.variant.price * item.quantity;
		}
		totalTaxAmount = data[0].totalTaxAmount as number;

		totalPayableAmount = totalPrice + deliveryCharges + totalTaxAmount;
	}

	return (
		<>
			{isFetched && data && (
				<div className="min-h-screen flex flex-col">
					<DashboardHeader title="Order Details" />
					<div className="lg:grid lg:grid-cols-12 divide-x flex-1">
						<div className="col-span-8 divide-y py-4 lg:p-4">
							<div className="flex flex-col lg:flex-row gap-8 lg:gap-4 p-4 justify-between">
								<div>
									<div>
										<h1 className="text-md text-muted-foreground">
											Order ID : #{data[0].id}
										</h1>
									</div>
									<div className="flex gap-2">
										<p>
											Order Date:{" "}
											<span className="font-medium">Feb 16 2025</span>
										</p>
										|<p className="text-primary">Delivery in 10 mins</p>
									</div>
								</div>
							</div>
							<div className="p-4 ">
								<h2 className="text-lg font-semibold">Order status</h2>
								<OrderStatusTimeline
									currentStatus={data[0]?.status as OrderStatus}
								/>
							</div>

							<div className="p-4">
								<h2 className="text-lg font-semibold">Items(s) ordered</h2>
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

						<div className="col-span-4 space-y-4 py-4 lg:p-4 divide-y border-t">
							<div className="space-y-4 p-4">
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
								</div>
							</div>
							<div className="flex justify-between items-center p-4">
								<p className="font-semibold text-xl">Total Payable</p>
								<p className="font-semibold text-3xl mb-2">
									{formatAmount(data[0]?.currency, totalPayableAmount)}
								</p>
							</div>
							<div className="space-y-4 p-4">
								<Label>Contact Info</Label>
								<div className="space-y-1">
									<p className="">Kundan Mahadev Bhosale</p>
									<p className="">
										<span>+91 9325029116</span>
									</p>
								</div>
							</div>
							<div className="space-y-4 p-4">
								<Label>Delivery Address</Label>
								<div className="space-y-1">
									<p className="">
										Bhagwan Pur, Chhapra - Rewa - Muzaffarpur Rd, Shrirampuri,
										Muzaffarpur
									</p>
									<p>Bhagwanpur</p>
									<p>842001</p>
									<p>Bihar, India</p>
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

							{/* <div className="space-y-2">
						<Label>Billing Address</Label>
						<div className="space-y-1">
							<p className="">
								Bhagwan Pur, Chhapra - Rewa - Muzaffarpur Rd, Shrirampuri,
								Muzaffarpur
							</p>
							<p>Bhagwanpur</p>
							<p>842001</p>
							<p>Bihar, India</p>
						</div>
					</div> */}
						</div>
					</div>
				</div>
			)}

			{isFetching && !data && <Spinner className="absolute left-1/2 top-1/2" />}
		</>
	);
}
