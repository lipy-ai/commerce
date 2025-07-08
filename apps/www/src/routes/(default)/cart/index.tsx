import { type CartStore, useCartStore } from "@/components/cart/store";

import { AddToCart } from "@/components/cart/addToCart";
import PlaceOrder from "@/components/order/placeOrder";
import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
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
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Bike,
	Check,
	ChevronDown,
	ChevronRight,
	Clock,
	Dog,
	MapPin,
	MapPinned,
	MessageSquareText,
	Package,
	Phone,
	ReceiptText,
	ScanBarcode,
	ShoppingBag,
	StickyNote,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/(default)/cart/")({
	component: RouteComponent,
});

const instructions = [
	{
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
	},
	{
		name: "storeInstructions",
		label: "Store Instructions",
		description: "We will inform the store about your preferences",
		icon: StickyNote,
		options: [
			{
				name: "prepare-fresh",
				label: "Prepare fresh items",
				icon: Check,
				description: "Please pack fresh and good-quality items only",
			},
			{
				name: "check-expiry",
				label: "Check expiry date",
				icon: ScanBarcode,
				description: "Ensure products are not close to expiry",
			},
			{
				name: "pack-securely",
				label: "Pack securely",
				icon: Package,
				description: "Ensure items are packed safely to avoid damage",
			},
			{
				name: "notify-if-unavailable",
				label: "Notify if item unavailable",
				icon: Clock,
				description: "Call or update me if any item is not available",
			},
		],
	},
] as const;

export type CompleteInstruction = {
	[K in (typeof instructions)[number]["name"]]: string;
};

function RouteComponent() {
	const { cart, setCart, resetCart } = useCartStore();
	const { deliveryLocation } = useLocationStore();
	const { isMobile } = useViewport();
	const [detailedAddressDrawerOpen, setDetailedAddressDrawerOpen] =
		useState(false);

	const [completeInstruction, setCompleteInstruction] =
		useState<CompleteInstruction>(
			Object.fromEntries(
				instructions.map((item) => [item.name, ""]),
			) as CompleteInstruction,
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
		<div className="">
			{isMobile && <DashboardHeader title="Cart" />}
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
						<Card>
							<CardHeader className="flex items-center justify-between border-b">
								<CardTitle>Order Item(s)</CardTitle>
								{cart.length > 0 && (
									<p className="text-muted-foreground">{cart.length} items</p>
								)}
							</CardHeader>
							<CardContent>
								{cart.map((product) => (
									<div key={product.inventoryId} className="py-4">
										<ProductComp product={product} />
									</div>
								))}
							</CardContent>
						</Card>

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
							<InstructionComp
								completeInstruction={completeInstruction}
								setCompleteInstruction={setCompleteInstruction}
							/>
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
							<PlaceOrder
								setOpen={setDetailedAddressDrawerOpen}
								completeInstruction={completeInstruction}
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
					<p className="line-clamp-2 text-sm leading-4">{product.title}</p>
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

function InstructionComp({
	completeInstruction,
	setCompleteInstruction,
}: {
	completeInstruction: CompleteInstruction;
	setCompleteInstruction: (instruction: CompleteInstruction) => void;
}) {
	const [drawerDialogOpen, setDrawerDialogOpen] = useState(false);
	const [selectedInstruction, setSelectedInstruction] =
		useState<(typeof instructions)[number]>();

	return (
		<div>
			<div className="rounded-xl bg-card divide-y divide-dashed">
				{instructions.map((instruction) => (
					<div
						key={instruction.name}
						className="flex items-center justify-between p-4"
						onClick={() => {
							setDrawerDialogOpen(true);
							setSelectedInstruction(instruction);
						}}
					>
						<div className="flex items-center gap-2">
							<instruction.icon className="size-6 stroke-2" />
							<div>
								<p className="font-medium">{instruction.label}</p>
								<p className="text-muted-foreground text-xs">
									{completeInstruction[instruction?.name] ||
										instruction.description}
								</p>
							</div>
						</div>
						<ChevronRight className="size-5" />
					</div>
				))}
			</div>

			{selectedInstruction && (
				<DrawerDialogSwitcher
					open={drawerDialogOpen}
					onOpenChange={setDrawerDialogOpen}
				>
					<DrawerDialogHeader>
						<div className="flex items-center gap-4">
							<selectedInstruction.icon className="size-8 stroke-2" />
							<div>
								<p className="font-medium">{selectedInstruction?.label}</p>
								<p className="text-muted-foreground text-xs">
									{selectedInstruction?.description}
								</p>
							</div>
						</div>
					</DrawerDialogHeader>
					<div className="space-y-2">
						{selectedInstruction.options.map((option) => (
							<div
								key={option.name}
								className={cn(
									completeInstruction[selectedInstruction.name] === option.label
										? "bg-primary/10 border-2 border-primary"
										: null,
									"flex items-center gap-4 p-4 border rounded-xl",
								)}
								onClick={() => {
									setCompleteInstruction({
										...completeInstruction,
										[selectedInstruction.name]: option.label,
									});
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
			)}
		</div>
	);
}
