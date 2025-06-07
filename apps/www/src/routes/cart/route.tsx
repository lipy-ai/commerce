import { useCartStore } from "@/components/cart/store";
import PlaceOrder from "@/components/order/placeOrder";
import ProductCard from "@/components/productCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Bike,
	ChevronDown,
	MapPinned,
	ReceiptText,
	ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/cart")({
	component: RouteComponent,
});

function RouteComponent() {
	const { cart, setCart, resetCart } = useCartStore();
	const { deliveryLocation } = useLocationStore();
	const [detailedAddressDrawerOpen, setDetailedAddressDrawerOpen] =
		useState(false);

	const {
		data = [],
		isFetched,
		isError,
		isFetching,
	} = useAPIQuery(
		apiClient.v1.cart,
		"$get",
		{},
		{
			refetchOnMount: true,
			refetchOnWindowFocus: true,
			staleTime: 0,
			cacheTime: 0,
		},
	);

	// Reset cart once on mount
	useEffect(() => {
		resetCart();
	}, [resetCart]);

	// Update cart when data changes
	useEffect(() => {
		if (isFetched && !isError && data.length > 0) {
			const mappedCart = data.map((item: any) => ({
				id: item.variantId,
				quantity: item.quantity,
				unit: item.variantUnit,
				title: item.variantTitle,
				price: item.variantPrice,
				maxPrice: item.variantMaxPrice,
				thumbnail: item.thumbnail,
			}));
			setCart(mappedCart);
		}
	}, [isFetched, isError, data, setCart]);

	const { totalPrice, totalMaxPrice } = useMemo(() => {
		return cart.reduce(
			(acc, item) => {
				acc.totalPrice += (item.price || 0) * (item.quantity || 0);
				acc.totalMaxPrice += (item.maxPrice || 0) * (item.quantity || 0);
				return acc;
			},
			{ totalPrice: 0, totalMaxPrice: 0 },
		);
	}, [cart]);

	const billingDetails = [
		{
			icon: ReceiptText,
			title: "Subtotal",
			value: (
				<div className="flex items-center gap-2">
					<p className="text-muted-foreground line-through">₹{totalMaxPrice}</p>
					<p>₹{totalPrice}</p>
				</div>
			),
		},
		{
			icon: Bike,
			title: "Delivery Charge",
			value: <div className="text-primary">Free</div>,
		},
		{
			icon: ShoppingBag,
			title: "Handling Charge",
			value: <div className="text-muted-foreground">₹0</div>,
		},
	];

	return (
		<div>
			<DashboardHeader title="Cart" />

			{isFetching &&
				Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="my-2 flex flex-col items-center">
						<Skeleton className="h-28 w-5/6" />
					</div>
				))}

			{isFetched && !isError && data.length > 0 && (
				<div className="relative">
					<div className="p-4">
						<Card className="p-4 shadow-none">
							<p className="text-lg font-semibold">Order Item(s)</p>
							<Separator className="-my-4 border-t border-dashed bg-transparent" />

							{cart.map((product) => (
								<div key={product.id} className="my-2">
									<ProductCard
										thumbnail={product.thumbnail ?? undefined}
										product={product}
										variant="horizontal"
										className={{ classNameImg: "w-14 h-14" }}
									/>
								</div>
							))}
						</Card>

						<Card className="p-4 shadow-none my-6 mb-44">
							<p className="text-lg font-semibold">Billing Details</p>
							<Separator className="-my-2 border-t border-dashed bg-transparent" />

							{billingDetails.map(({ icon: Icon, title, value }) => (
								<div
									key={title}
									className="flex items-center justify-between -my-1"
								>
									<div className="flex items-center gap-2">
										<Icon className="size-4" />
										<p className="font-semibold text-muted-foreground">
											{title}
										</p>
									</div>
									<div>{value}</div>
								</div>
							))}

							<Separator className="-my-2" />
							<div className="flex items-center justify-between">
								<p className="text-lg font-semibold">Total</p>
								<p className="text-lg font-semibold">₹{totalPrice}</p>
							</div>
						</Card>
					</div>

					{/* Bottom Checkout UI */}
					<div className="fixed bottom-0 border-t left-0 w-full bg-white shadow-md border-2 rounded-t-lg">
						<div
							className="bg-accent rounded-t-lg p-2 cursor-pointer"
							onClick={() => setDetailedAddressDrawerOpen(true)}
						>
							<div className="flex items-center gap-2">
								<MapPinned className="size-10 fill-primary/40" />
								<div>
									<div className="flex items-center gap-2">
										<p className="text-lg font-semibold">
											Delivering to{" "}
											{deliveryLocation?.tag?.charAt(0).toUpperCase() +
												deliveryLocation?.tag?.slice(1)}
										</p>
										<ChevronDown className="size-5" />
									</div>
									<p className="line-clamp-1 text-xs">
										{deliveryLocation?.line1}
									</p>
								</div>
							</div>
						</div>

						<div className="p-4 flex items-center justify-between gap-2">
							<div className="w-1/4 rounded-md border border-violet-600 p-1 bg-violet-200 text-violet-600 font-medium h-12 text-sm flex items-center justify-center">
								Pay on delivery
							</div>

							<div className="w-full border p-1 rounded-md flex items-center justify-between px-2 bg-emerald-200 border-emerald-600 h-12">
								<div>
									<p className="text-xs font-medium">Total Bill</p>
									<p className="text-lg font-semibold">₹{totalPrice}</p>
								</div>
								<PlaceOrder setOpen={setDetailedAddressDrawerOpen} />
							</div>
						</div>
					</div>
				</div>
			)}

			{isFetched && !isError && data.length === 0 && (
				<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<EmptyPage icon={ShoppingBag} title="Your Cart is Empty" label=" ">
						<Link
							className={cn(
								buttonVariants({ size: "default", className: "text-lg" }),
								"my-6",
							)}
							to="/"
						>
							Browse Products
						</Link>
					</EmptyPage>
				</div>
			)}

			{detailedAddressDrawerOpen && (
				<DetailedAddress
					fullAddress={deliveryLocation}
					open={detailedAddressDrawerOpen}
					onOpenChange={setDetailedAddressDrawerOpen}
					label={deliveryLocation?.id ? "Edit" : "Add"}
					isDeliveryAddress
				/>
			)}
		</div>
	);
}
