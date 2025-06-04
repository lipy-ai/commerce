import CustomAvatarGroup from "@lipy/web-ui/components/custom-ui/customAvatarGroup";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	CheckCircle,
	CheckCircle2,
	DollarSign,
	HelpCircle,
	Package,
	RefreshCw,
	RotateCcw,
	ShoppingCart,
	Truck,
	XCircle,
} from "lucide-react";

type OrdersData = {
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
	storeLogo: string | null;
	storeId: string | null;
	orderPrimaryId: string | null;
}[];

type Order = OrdersData[number];

type MyOrderCardProps = {
	order: Order;
};

export default function MyOrderCard({ order }: MyOrderCardProps) {
	const displayItems = (order?.items ?? []).slice(0, 2);
	const remainingItems = Math.max(0, (order?.items ?? []).length - 2);

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
		order.status as
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
		<>
			<Card className="rounded-xl py-2 bg-white">
				<CardContent className="p-0">
					<Link to={"/shop/$id"} params={{ id: order.storeId as string }}>
						<div className="flex gap-2 items-center p-4">
							<Avatar className="rounded-md size-12">
								<AvatarImage src={order.storeLogo || ""} />
								<AvatarFallback className="rounded-lg bg-indigo-500 text-white">
									{order.storeName?.[0] ?? "S"}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="fomt-semibold line-clamp-1">{order.storeName}</p>
								<p className="text-muted-foreground line-clamp-1">
									{"Paschim Vihar, New Delhi"}
								</p>
							</div>
						</div>
					</Link>

					<Separator />
					<div className="p-4">
						<Link
							to={"/account/orders/$orderId"}
							params={{ orderId: order.orderPrimaryId as string }}
						>
							<div className="flex justify-start gap-4">
								<CustomAvatarGroup items={order.items ?? []} />
								<div className="text-sm">
									{displayItems.map((item, index) => (
										<span key={item.id}>
											{item.title}
											{item.quantity > 1 && ` (${item.quantity})`}
											{index < displayItems.length - 1 && ", "}
										</span>
									))}
									{remainingItems > 0 && (
										<span className="text-sm">
											{displayItems.length > 0 && ", "}+{remainingItems} more
										</span>
									)}
								</div>
							</div>
							<Separator className="border-t border-dashed bg-transparent my-4" />

							<div className="flex justify-between">
								<p className="text-muted-foreground">
									Ordered on {format(order.orderedAt, "PPp")}
								</p>
								<p className="font-medium">₹{order.itemTotalAmount}</p>
							</div>
							<Separator className="border-t border-dashed bg-transparent my-4" />
							<div className="flex items-center gap-2">
								{statusConfig.icon && (
									<statusConfig.icon className={statusConfig.color} size={16} />
								)}
								<p className={`${statusConfig.color} font-medium`}>
									{statusConfig.label}
								</p>
							</div>
						</Link>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
