import { CartPage } from "@/components/cart/cartPage";
import { useCartStore } from "@/components/cart/store";
import ProductCard from "@/components/productCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import {
	Bike,
	Navigation,
	ReceiptText,
	ShoppingBag,
	StepForward,
} from "lucide-react";

export const Route = createFileRoute("/cart")({
	component: RouteComponent,
});

function RouteComponent() {
	const { cart } = useCartStore();

	const { deliveryLocation } = useLocationStore();

	let total_max_price = 0;
	let total_price = 0;

	for (const item of cart) {
		total_max_price += item.max_price * item.quantity;
		total_price += item.price * item.quantity;
	}

	const billingDetails = [
		{
			icon: ReceiptText,
			title: "Subtotal",
			value: () => {
				return (
					<div className="flex items-center gap-2">
						<p className="text-muted-foreground line-through">
							₹{total_max_price}
						</p>
						<p>₹{total_price}</p>
					</div>
				);
			},
		},
		{
			icon: Bike,
			title: "Delivery Charge",
			value: () => {
				return <div className="text-primary">Free</div>;
			},
		},
		{
			icon: ShoppingBag,
			title: "Handling Charge",
			value: () => {
				return <div className="text-muted-foreground">₹0</div>;
			},
		},
	];
	return (
		<div>
			<DashboardHeader title="Cart" />

			{cart.length > 0 ? (
				<div className="relative">
					<div className="p-4">
						<Card className="p-4 shadow-none">
							<p className="text-lg font-semibold">Order Item(s)</p>
							<Separator className="-my-4 border-t border-dashed bg-transparent" />
							{cart.map((product) => {
								return (
									<div key={product.id} className="my-2">
										<ProductCard
											product={product}
											variant={"horizontal"}
											className={{
												classNameImg: "w-14 h-14",
											}}
										/>
									</div>
								);
							})}
						</Card>

						<Card className="p-4 shadow-none my-6 mb-44">
							<p className="text-lg font-semibold">Billing Details</p>
							<Separator className="-my-4 border-t border-dashed bg-transparent" />

							{billingDetails.map((item) => {
								return (
									<div
										key={item.title}
										className=" flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<item.icon className="size-4" />
											<p className="font-semibold text-muted-foreground">
												{item.title}
											</p>
										</div>

										<div>{item.value()}</div>
									</div>
								);
							})}

							<Separator className="-my-2" />
							<div className="flex items-center justify-between">
								<p className="text-lg font-semibold">Total</p>
								<p className="text-lg font-semibold">₹{total_price}</p>
							</div>
						</Card>
					</div>

					<div className="absolute fixed  bottom-0 border-t left-0 w-full rounded-tl-lg rounded-tr-lg bg-white shadow-md border-2">
						<div className="bg-accent rounded-lg">
							<div className="flex items-center gap-2 pt-2 mb-4  px-4 justify-between">
								<div className="flex items-center gap-2">
									<Navigation className="fill-primary text-primary size-8" />
									<div>
										<p className="text-primary text-lg font-semibold">
											Delivering to
										</p>
										<p className="text-muted-foreground line-clamp-1 text-xs">
											{deliveryLocation.address}
										</p>
									</div>
								</div>

								<Button variant={"outline"}>Change</Button>
							</div>
							<Separator className="border-t border-dashed bg-transparent" />
						</div>

						<div className="p-4 flex items-center justify-between gap-2">
							<div className="w-1/3 rounded-md border border-violet-600 p-1 bg-violet-200 text-violet-600 font-medium h-12">
								Cash on delivery
							</div>

							<div className="w-full border p-1 rounded-md flex items-center justify-between px-2 bg-emerald-200 border-emerald-600 h-12">
								<div>
									<p className="text-xs font-medium">Total Bill</p>
									<p className="text-lg font-semibold">₹{total_price}</p>
								</div>

								<Button>
									<p>Place Order</p>
									<StepForward />
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<EmptyPage icon={ShoppingBag} title="Your Cart is Empty" label=" " />
				</div>
			)}
		</div>
	);
}
