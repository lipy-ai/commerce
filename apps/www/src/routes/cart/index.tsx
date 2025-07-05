import { DeliveryInstruction } from "@/components/cart/instructions";
import { type CartStore, useCartStore } from "@/components/cart/store";

import { AddToCart } from "@/components/cart/addToCart";
import PlaceOrder from "@/components/order/placeOrder";
import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Bike,
	ChevronDown,
	ChevronRight,
	MapPinned,
	MessageSquareText,
	Plus,
	ReceiptText,
	ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/cart/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { cart, setCart, resetCart } = useCartStore();
	const { deliveryLocation } = useLocationStore();
	const { isMobile } = useViewport();
	const [detailedAddressDrawerOpen, setDetailedAddressDrawerOpen] =
		useState(false);
	const [deliveryInstructionDrawerOpen, setDeliveryInstructionDrawerOpen] =
		useState(false);

	const [completeDeliveryInstruction, setCompleteDeliveryInstruction] =
		useState("");

	const {
		data = [],
		isFetched,
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

	useEffect(() => {
		resetCart();
	}, [resetCart]);

	// Update cart when data changes
	useEffect(() => {
		if (isFetched && data.length > 0) {
			setCart(data);
		}
	}, [isFetched, data, setCart]);

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
					<p className="text-muted-foreground line-through">
						{formatAmount("inr", totalMaxPrice)}
					</p>
					<p>{formatAmount("inr", totalPrice)}</p>
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
			value: (
				<div className="text-muted-foreground">{formatAmount("inr", 0)}</div>
			),
		},
	];

	return (
		<div className="[view-transition-name:main-content]">
			{isMobile && <DashboardHeader title="Cart" />}

			{isFetched && data && data.length > 0 && (
				<div className="relative max-w-screen-lg m-auto">
					<div className="space-y-6 my-4 gap-4">
						<Card className="">
							<CardContent className="divide-y  p-0">
								<CardHeader className="p-4 flex items-center justify-between">
									<CardTitle>Order Items(s)</CardTitle>
									{cart.length > 0 && (
										<p className="text-muted-foreground">{cart.length} items</p>
									)}
								</CardHeader>
								<div className="px-4">
									{cart.map((product) => (
										<div key={product.inventoryId} className=" py-4">
											<ProductComp product={product} />
										</div>
									))}
								</div>

								<CardFooter className="justify-between p-4">
									<p className="font-medium  ">Forgot something ?</p>
									<Button variant="secondary" size="sm">
										<Plus />
										Add more items
									</Button>
								</CardFooter>
							</CardContent>
						</Card>

						<Card className="">
							<CardContent className="p-0 divide-y">
								<CardHeader className="p-4 ">
									<CardTitle>Billing Details</CardTitle>
								</CardHeader>
								<div className="p-4">
									{billingDetails.map(({ icon: Icon, title, value }) => (
										<div
											key={title}
											className="flex items-center justify-between py-2"
										>
											<div className="flex items-center gap-2">
												<Icon className="size-4" />
												<p className="text-sm">{title}</p>
											</div>
											<div className="">{value}</div>
										</div>
									))}
								</div>

								<CardFooter className="p-4">
									<div className=" flex items-center justify-between w-full">
										<p className="text-lg font-semibold">Total Payable</p>
										<p className="text-lg font-semibold">₹{totalPrice}</p>
									</div>
								</CardFooter>
							</CardContent>
						</Card>

						<div className="p-4 mb-42 shadow-none rounded-xl bg-card border-none">
							<div
								className="flex items-center justify-between"
								onClick={() => setDeliveryInstructionDrawerOpen(true)}
							>
								<div className="flex items-center gap-4">
									<MessageSquareText />
									<div>
										<p className="font-medium text-sm">Delivery Instruction</p>
										<p className="text-muted-foreground text-xs">
											We will inform the delivery partner.
										</p>
									</div>
								</div>

								<ChevronRight />
							</div>
						</div>
					</div>

					{/* Bottom Checkout UI */}
					<div className="fixed bottom-0 border-t  w-full bg-card shadow-xl border-2 rounded-t-lg max-w-screen-lg">
						<div
							className="bg-accent/40 rounded-t-xl p-2 cursor-pointer"
							onClick={() => setDetailedAddressDrawerOpen(true)}
						>
							<div className="flex items-center gap-2">
								<Avatar className="rounded-md">
									<AvatarFallback>
										<MapPinned className="size-6 fill-primary/40" />
									</AvatarFallback>
								</Avatar>

								<div>
									<div className="flex items-center gap-2">
										<p className="font-semibold">
											Delivering to{" "}
											{deliveryLocation?.tag?.charAt(0).toUpperCase() +
												deliveryLocation?.tag?.slice(1)}
										</p>
										<ChevronDown className="size-5" />
									</div>
									<p className="line-clamp-1 text-xs">
										{[
											deliveryLocation?.name,
											deliveryLocation?.metadata?.building,
											deliveryLocation?.line1,
										]
											.filter(Boolean)
											.join(", ")}
									</p>
								</div>
							</div>
						</div>

						<div className="px-4 py-2">
							<PlaceOrder
								setOpen={setDetailedAddressDrawerOpen}
								deliveryInstruction={completeDeliveryInstruction}
							/>
						</div>
					</div>
				</div>
			)}

			{isFetched && data && data.length === 0 && (
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
			)}
			{isFetching && [
				Array(5).map((_, indx) => (
					<div key={indx}>
						<Skeleton className="h-12 w-full" />
					</div>
				)),
			]}

			{detailedAddressDrawerOpen && (
				<DetailedAddress
					fullAddress={deliveryLocation}
					open={detailedAddressDrawerOpen}
					onOpenChange={setDetailedAddressDrawerOpen}
					label={"Edit"}
					isDeliveryAddress
				/>
			)}

			{deliveryInstructionDrawerOpen && (
				<DeliveryInstruction
					open={deliveryInstructionDrawerOpen}
					onOpenChange={setDeliveryInstructionDrawerOpen}
					setCompleteInstruction={setCompleteDeliveryInstruction}
				/>
			)}
		</div>
	);
}

export function ProductComp({
	product,
}: {
	product: CartStore["cart"][0];
}) {
	return (
		<div className={cn("flex items-center justify-between gap-4")}>
			<div className="flex items-start gap-2">
				<div className=" relative aspect-square size-16">
					<img
						alt={""}
						src={product.thumbnail || "/assets/paper-bag-items.webp"}
						className={cn("w-full h-full object-cover rounded-md bg-accent")}
					/>
				</div>

				<div>
					<p className="font-medium line-clamp-2">{product.title}</p>
					<p className="text-muted-foreground text-xs">
						{product.quantity} x {product.unit}
					</p>
				</div>
			</div>
			<div className="flex flex-col items-end gap-1">
				<AddToCart product={product} variant={"icon"} />
				<div className="flex items-center gap-2">
					<p className="line-through text-muted-foreground">
						{formatAmount(
							"inr",
							(product?.maxPrice ?? 0) * (product?.quantity ?? 0),
						)}
					</p>
					<p className="font-semibold">
						{formatAmount(
							"inr",
							(product.price ?? 0) * (product.quantity ?? 0),
						)}
					</p>
				</div>
			</div>
		</div>
	);
}
