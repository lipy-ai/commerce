import { DeliveryInstruction } from "@/components/cart/instructions";
import { useCartStore } from "@/components/cart/store";
import PlaceOrder from "@/components/order/placeOrder";
import ProductCard from "@/components/productCard";
import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
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
import { Separator } from "@lipy/web-ui/components/ui/separator";
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

export const Route = createFileRoute("/cart")({
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
	console.log(data);
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

	const totalDiscount = totalMaxPrice - totalPrice;

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
		<div>
			{isMobile && <DashboardHeader title="Cart" />}

			{isFetching && (
				<div className="relative m-auto max-w-screen-lg">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="my-2 flex flex-col items-center">
							<Skeleton className="h-28 w-5/6" />
						</div>
					))}
				</div>
			)}

			{isFetched && !isError && data.length > 0 && (
				<div className="relative max-w-screen-lg m-auto">
					<div className="p-4 space-y-6 mb-4 gap-4">
						<Card className="">
							<CardHeader>
								<CardTitle>Order Item(s)</CardTitle>
							</CardHeader>
							<CardContent className="divide-y py-0 divide-dashed">
								{cart.map((product) => (
									<div key={product.id} className=" py-4">
										<ProductCard
											thumbnail={product.thumbnail ?? undefined}
											product={product}
											variant="horizontal"
											className={{ classNameImg: "w-12 h-12" }}
										/>
									</div>
								))}
								{/* <Separator className="-my-2 border-t border-dashed bg-transparent" /> */}
							</CardContent>
							<CardFooter className="justify-between bg-white p-4 rounded">
								{/* <div className="flex items-center justify-between"> */}
								<p className="font-medium">Forgot something ?</p>
								<Button variant="black" size="sm">
									<Plus />
									Add more items
								</Button>
								{/* </div> */}
							</CardFooter>
						</Card>
						<Separator />
						<Card className="">
							<CardHeader>
								<CardTitle>Billing Details</CardTitle>
							</CardHeader>
							<CardContent className="divide-y py-2 divide-dashed">
								{billingDetails.map(({ icon: Icon, title, value }) => (
									<div
										key={title}
										className="flex items-center justify-between py-2"
									>
										<div className="flex items-center gap-2">
											<Icon className="size-4" />
											<p className="font-medium text-muted-foreground">
												{title}
											</p>
										</div>
										<div className="">{value}</div>
									</div>
								))}
							</CardContent>
							<CardFooter className=" bg-white rounded w-full flex flex-col">
								<div className=" flex items-center justify-between w-full p-4">
									<p className="text-lg font-semibold">Total Payable</p>
									<p className="text-lg font-semibold">₹{totalPrice}</p>
								</div>

								{totalDiscount > 0 && (
									<div className="bg-blue-50 text-blue-600 text-sm font-medium w-full rounded-b p-4">
										Yayy, you are saving {formatAmount("inr", totalDiscount)} on
										this order
									</div>
								)}
							</CardFooter>
						</Card>

						<div className="p-4 mb-42 shadow-none rounded-xl bg-white border-none">
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
					<div className="fixed bottom-0 border-t  w-full bg-white shadow-xl border-2 rounded-t-lg max-w-screen-lg">
						<div
							className="bg-accent/40 rounded-t-lg p-2 cursor-pointer"
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
										<p className="text-sm font-semibold">
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

			{isFetched && !isError && data.length === 0 && (
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
