import { formatAmount } from "@lipy/lib/utils/intl";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent, CardFooter } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ArrowRight,
	Building,
	CheckCircle,
	CheckCircle2,
	DollarSign,
	HelpCircle,
	House,
	MapPinHouse,
	Package,
	RefreshCw,
	RotateCcw,
	ShoppingCart,
	Store,
	Truck,
	XCircle,
} from "lucide-react";

interface Order {
	storeId: string | null;
	storeName: string | null;
	status:
		| "ordered"
		| "accepted"
		| "packed"
		| "out_for_delivery"
		| "delivered"
		| "return_requested"
		| "refunded"
		| "replaced"
		| "cancelled"
		| null;
	address: {
		name: string;
		state: string;
		country: string;
		tag: "home" | "work" | "other";
		line1: string;
		line2: string;
		city: string;
		postalCode: string;
		lat: number;
		lng: number;
		phone?: string | undefined;
	} | null;
	id: string;
	items:
		| {
				id: string;
				title: string;
				quantity: number;
				thumbnail: string;
				variant: {
					id: string;
					title: string;
					maxPrice: number;
					price: number;
				};
		  }[]
		| null;
	orderedAt: string;
	itemTotalAmount: number | null;
	orderPrimaryId: string | null;
	storeLogo: string | null;
}

export function MyOrderCard({ order }: { order: Order }) {
	return (
		<>
			<Card className="p-1 rounded-lg bg-white border-none shadow-sm">
				<CardContent className="p-2">
					<Link
						to="/account/orders/$orderId"
						params={{ orderId: order.orderPrimaryId as string }}
						className="space-y-4"
					>
						<div className="flex items-start justify-between gap-4">
							<StatusBadge
								status={order.status}
								className="font-semibold text-base"
								size={24}
							>
								<p className="text-xs text-muted-foreground">
									Ordered on {format(order.orderedAt, "Pp")}
								</p>
							</StatusBadge>
							<ArrowRight />
						</div>
						<Separator />
						<div className="flex items-center justify-between gap-2 divide-x divide-foreground">
							<div className="flex-1 flex items-center gap-2 pr-2">
								<Store className="flex-shrink-0 size-5" />

								<div>
									<p className="font-medium line-clamp-1">
										{order.storeName || "Unknown Store"}
									</p>
									<p className="text-muted-foreground text-xs line-clamp-1">
										Paschim Vihar , Delhi
									</p>
								</div>
							</div>

							<div className="flex-1 flex items-center gap-2 ">
								{order?.address?.tag === "home" ? (
									<House className="flex-shrink-0 size-5" />
								) : order?.address?.tag === "work" ? (
									<Building className="  flex-shrink-0 size-5" />
								) : (
									<MapPinHouse className="size-5  flex-shrink-0 " />
								)}

								<div>
									<p className="font-medium line-clamp-1">
										{(order?.address?.tag &&
											order?.address?.tag.charAt(0).toUpperCase() +
												order?.address?.tag.slice(1)) ||
											"Other"}
									</p>
									<p className="text-muted-foreground text-xs line-clamp-1">
										{order?.address?.line1 || "No address provided"}
									</p>
								</div>
							</div>
						</div>

						{order.items && order.items.length > 0 && (
							// The selected code with types
							<div className="grid grid-cols-6 lg:grid-cols-8 gap-2">
								{order.items.map((item, index) => (
									<Avatar
										key={index}
										className="rounded-md md:size-12 lg:size-20"
									>
										<AvatarImage src={item.thumbnail || ""} />
										<AvatarFallback className="rounded-lg bg-indigo-500 text-white">
											{item.variant.title?.[0] ?? "I"}
										</AvatarFallback>
									</Avatar>
								))}
							</div>
						)}

						<Separator />
						<CardFooter className="flex items-center justify-between w-full">
							<p className="font-medium text-sm">
								Total Amount :{" "}
								{formatAmount("inr", order.itemTotalAmount as number)}{" "}
							</p>
							{order.status === "delivered" && (
								<Button
									variant={"green"}
									size="sm"
									className="font-semibold -my-2"
								>
									Reorder
								</Button>
							)}
						</CardFooter>
					</Link>
				</CardContent>
			</Card>
		</>
	);
}

export const StatusBadge = ({
	status,
	children,
	className,
	size = 14,
}: {
	status: any;
	children?: React.ReactNode;
	className?: string;
	size?: number;
}) => {
	const getStatusConfig = (
		status:
			| "ordered"
			| "accepted"
			| "packed"
			| "out_for_delivery"
			| "delivered"
			| "return_requested"
			| "refunded"
			| "replaced"
			| "cancelled",
	) => {
		const configs = {
			ordered: {
				label: "Ordered",
				variant: "secondary" as const,
				icon: ShoppingCart,
				color: "text-blue-600",
			},
			accepted: {
				label: "Accepted",
				variant: "default" as const,
				icon: CheckCircle,
				color: "text-green-600",
			},
			packed: {
				label: "Packed",
				variant: "default" as const,
				icon: Package,
				color: "text-orange-600",
			},
			out_for_delivery: {
				label: "Out for Delivery",
				variant: "default" as const,
				icon: Truck,
				color: "text-purple-600",
			},
			delivered: {
				label: "Delivered",
				variant: "default" as const,
				icon: CheckCircle2,
				color: "text-green-700",
			},
			return_requested: {
				label: "Return Requested",
				variant: "destructive" as const,
				icon: RotateCcw,
				color: "text-yellow-600",
			},
			refunded: {
				label: "Refunded",
				variant: "outline" as const,
				icon: DollarSign,
				color: "text-gray-600",
			},
			replaced: {
				label: "Replaced",
				variant: "outline" as const,
				icon: RefreshCw,
				color: "text-blue-700",
			},
			cancelled: {
				label: "Cancelled",
				variant: "destructive" as const,
				icon: XCircle,
				color: "text-red-600",
			},
		} as const;
		return (
			configs[status] || {
				label: status,
				variant: "secondary" as const,
				icon: HelpCircle,
				color: "text-gray-500",
			}
		);
	};
	const statusConfig = getStatusConfig(
		status as
			| "ordered"
			| "accepted"
			| "packed"
			| "out_for_delivery"
			| "delivered"
			| "return_requested"
			| "refunded"
			| "replaced"
			| "cancelled",
	);

	return (
		<div className="flex items-center gap-2">
			{statusConfig.icon && (
				<statusConfig.icon className={statusConfig.color} size={size} />
			)}
			<div>
				<p className={cn("font-medium", className)}>{statusConfig.label}</p>
				{children}
			</div>
		</div>
	);
};
