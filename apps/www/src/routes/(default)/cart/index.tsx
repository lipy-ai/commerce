import { type CartStore, useCartStore } from "@/components/cart/store";

import { AddToCart } from "@/components/cart/addToCart";
import PlaceOrder from "@/components/order/placeOrder";
import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
	apiQueryOptions,
	useAPIMutation,
	useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
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
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Bike,
	ChevronDown,
	ChevronRight,
	Clock,
	Dog,
	MapPin,
	MapPinned,
	MessageSquareText,
	Phone,
	ReceiptText,
	ShoppingBag,
	Store,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/(default)/cart/")({
	component: RouteComponent,
});

const deliveryInstructions = {
	name: "deliveryInstructions",
	label: "Delivery Instructions",
	description: "We will inform the delivery partner",
	icon: MessageSquareText,
	options: [
		{
			name: "leave-at-door",
			label: "Leave at door",
			icon: MapPin,
			description: "Leave the order at my doorstep",
		},
		{
			name: "ring-doorbell",
			label: "Ring doorbell",
			icon: Clock,
			description: "Please ring the doorbell upon arrival",
		},
		{
			name: "call-on-arrival",
			label: "Call on arrival",
			icon: Phone,
			description: "Call me when you arrive",
		},
		{
			name: "pet-at-home",
			label: "Pet is at home",
			icon: Dog,
			description: "Beware of pets at home",
		},
	],
};

function RouteComponent() {
	const { cart, setCart, resetCart } = useCartStore();
	const { deliveryLocation } = useLocationStore();
	const { isMobile } = useViewport();
	const [detailedAddressDrawerOpen, setDetailedAddressDrawerOpen] =
		useState(false);
	const queryClient = useQueryClient();
	const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);
	const [removingShopHandle, setRemovingShopHandle] = useState("");

	const removeFromCart = useAPIMutation(
		apiClient.v1.cart[":shopHandle"],
		"$delete",
		{
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: apiQueryOptions(apiClient.v1.cart, "$get", {}).queryKey,
				});
			},
		},
	);

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

	const totalDiscount = useMemo(() => {
		return Math.floor(totalMaxPrice - totalPrice);
	}, [totalPrice, totalMaxPrice]);

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

	const storeWiseItems = new Map<string, CartStore["cart"]>();

	for (const item of cart) {
		const storeHandle = item?.storeHandle ?? "";

		let items = storeWiseItems.get(storeHandle);

		if (!items) {
			items = [];
			storeWiseItems.set(storeHandle, items);
		}

		items.push(item);
	}

	const handleRemoveFromCart = async (shopHandle: string) => {
		try {
			setIsRemovingFromCart(true);
			setRemovingShopHandle(shopHandle);
			await removeFromCart.mutateAsync({
				param: {
					shopHandle: shopHandle,
				},
			});
		} finally {
			setIsRemovingFromCart(false);
		}
	};

	return (
		<div className="">
			{isMobile && (
				<DashboardHeader
					titleChildren={
						<div>
							<p
								className={cn(
									cart.length === 0 ? "text-lg" : "text-base",
									"font-semibold",
								)}
							>
								Your cart
							</p>
							<p
								className={cn(
									cart.length === 0 && "hidden",
									"text-muted-foreground text-xs",
								)}
							>
								{storeWiseItems.size ?? 0} stores | {cart.length || 0} items
							</p>
						</div>
					}
				>
					{totalDiscount > 0 && (
						<Badge variant="success" size="spacious">
							SAVED {formatAmount("inr", totalDiscount)}
						</Badge>
					)}
				</DashboardHeader>
			)}
			{isFetching && [
				Array(5).map((_, indx) => (
					<div key={indx}>
						<Skeleton className="h-12 w-full" />
					</div>
				)),
			]}

			{isFetched && data && data.length > 0 && (
				<div className="relative max-w-screen-lg m-auto p-4">
					<div className="space-y-6 my-4 gap-4">
						{Array.from(storeWiseItems.entries()).map(
							([storeHandle, storeData]) => (
								<Card key={storeHandle} className="mb-6">
									{/* Store name header */}
									<CardHeader className="flex items-center justify-between mb-2 border-b -mx-4 ">
										<Link
											className="flex items-center gap-2 px-4"
											to="/$storeHandle"
											params={{ storeHandle }}
										>
											<Avatar className="rounded-md size-10">
												<AvatarImage src={storeData[0].storeLogo || ""} />
												<AvatarFallback>
													<Store />
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-base font-semibold">
													{storeData[0].storeName}
												</p>
												<p className="text-sm text-muted-foreground">
													{storeData.length} item
													{storeData.length > 1 ? "s" : ""}
												</p>
											</div>
										</Link>
										<p
											className="text-muted-foreground underline decoration-dashed px-4"
											style={{ textUnderlineOffset: "4px" }}
											onClick={() => handleRemoveFromCart(storeHandle)}
										>
											{isRemovingFromCart && removingShopHandle === storeHandle
												? "Removing..."
												: "Remove"}
										</p>
									</CardHeader>

									<CardContent className="space-y-6">
										{storeData.map((product) => (
											<div key={product.inventoryId}>
												<ProductComp product={product} />
											</div>
										))}
									</CardContent>
								</Card>
							),
						)}

						<Card>
							<CardHeader>
								<CardTitle>Billing details</CardTitle>
							</CardHeader>
							<CardContent>
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
							</CardContent>
							<CardFooter className="border-t">
								<div className=" flex items-center justify-between w-full">
									<p className="text-base font-semibold">Total Payable</p>
									<p className="text-base font-semibold">₹{totalPrice}</p>
								</div>
							</CardFooter>
						</Card>

						<div className="mb-40">
							<DeliveryInstruction />
						</div>
					</div>

					{/* Bottom Checkout UI */}
					<div className="fixed bottom-0 left-0 right-0 border-t  w-full bg-card shadow-xl border-2 rounded-t-xl max-w-screen-lg ">
						<div
							className="rounded-t-xl p-2 cursor-pointer border-b border-dashed"
							onClick={() => setDetailedAddressDrawerOpen(true)}
						>
							<div className="flex items-center gap-2">
								<Avatar className="rounded-md">
									<AvatarFallback>
										<MapPinned className="size-6 fill-secondary/40" />
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
							<PlaceOrder setOpen={setDetailedAddressDrawerOpen} />
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

			{detailedAddressDrawerOpen && (
				<DetailedAddress
					fullAddress={deliveryLocation}
					open={detailedAddressDrawerOpen}
					onOpenChange={setDetailedAddressDrawerOpen}
					label={"Edit"}
					isDeliveryAddress
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
				<div className=" relative aspect-square size-12">
					<Link
						to="/$storeHandle/products/$productId"
						params={{
							storeHandle: product?.storeHandle ?? "",
							productId: product?.productId ?? "",
						}}
					>
						<img
							alt={""}
							src={product.thumbnail || "/assets/paper-bag-items.webp"}
							className={cn("w-full h-full object-cover rounded-md bg-accent")}
						/>
					</Link>
				</div>

				<div>
					<p className="line-clamp-2  leading-4">{product.title}</p>
					<p className="text-muted-foreground text-xs">
						{product.quantity} x {product.unit}
					</p>
				</div>
			</div>
			<div className="flex flex-col items-end gap-1">
				<AddToCart
					product={product}
					variant={"primary"}
					activeVariant="tertiary-active"
				/>
				<div className="flex items-center gap-2">
					{product.maxPrice && product.maxPrice > (product.price ?? 0) && (
						<p className="line-through text-muted-foreground">
							{formatAmount(
								"inr",
								(product?.maxPrice ?? 0) * (product?.quantity ?? 0),
							)}
						</p>
					)}

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

function DeliveryInstruction() {
	const [drawerDialogOpen, setDrawerDialogOpen] = useState(false);
	const { instructions, setInstructions } = useCartStore();
	return (
		<div>
			<div className="rounded-xl bg-card divide-y divide-dashed">
				<div
					className="flex items-center justify-between p-4"
					onClick={() => {
						setDrawerDialogOpen(true);
					}}
				>
					<div className="flex items-center gap-2">
						<deliveryInstructions.icon className="size-6 stroke-2" />
						<div>
							<p className="font-medium">{deliveryInstructions.label}</p>
							<p className="text-muted-foreground text-xs">
								{instructions.deliveryInstruction ||
									deliveryInstructions.description}
							</p>
						</div>
					</div>
					<ChevronRight className="size-5" />
				</div>
			</div>

			<DrawerDialogSwitcher
				open={drawerDialogOpen}
				onOpenChange={setDrawerDialogOpen}
			>
				<DrawerDialogHeader>
					<div className="flex items-center gap-4">
						<deliveryInstructions.icon className="size-8 stroke-2" />
						<div>
							<p className="font-medium">{deliveryInstructions.label}</p>
							<p className="text-muted-foreground text-xs">
								{deliveryInstructions.description}
							</p>
						</div>
					</div>
				</DrawerDialogHeader>
				<div className="space-y-2">
					{deliveryInstructions.options.map((option) => (
						<div
							key={option.name}
							className={cn(
								instructions.deliveryInstruction === option.label &&
									"bg-primary/10 ring ring-primary",
								"flex items-center gap-4 p-4 border rounded-xl",
							)}
							onClick={() => {
								setInstructions({ deliveryInstruction: option.label });
							}}
						>
							<option.icon className="size-6 stroke-1.5" />
							<div>
								<p className="font-medium">{option.label}</p>
								<p className="text-muted-foreground text-xs">
									{option.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</DrawerDialogSwitcher>
		</div>
	);
}
