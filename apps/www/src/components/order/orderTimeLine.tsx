import {
	CheckCircle,
	Clock,
	DollarSign,
	Home,
	Package,
	RefreshCw,
	RotateCcw,
	Truck,
	X,
} from "lucide-react";
import React from "react";

const ORDER_STATUS_FLOW: OrderStatus[] = [
	"ordered",
	"accepted",
	"cancelled",
	"packed",
	"out_for_delivery",
	"delivered",
	"return_requested",
	"refunded",
	"replaced",
];

const statusConfig = {
	ordered: {
		label: "Order Placed",
		icon: Clock,
		color: "text-blue-600",
		bgColor: "bg-blue-100",
		description: "Your order has been placed successfully",
	},
	accepted: {
		label: "Order Accepted",
		icon: CheckCircle,
		color: "text-green-600",
		bgColor: "bg-green-100",
		description: "Your order has been confirmed and accepted",
	},
	packed: {
		label: "Packed",
		icon: Package,
		color: "text-purple-600",
		bgColor: "bg-purple-100",
		description: "Your order has been packed and ready for shipment",
	},
	out_for_delivery: {
		label: "Out for Delivery",
		icon: Truck,
		color: "text-orange-600",
		bgColor: "bg-orange-100",
		description: "Your order is on the way to your delivery address",
	},
	delivered: {
		label: "Delivered",
		icon: Home,
		color: "text-green-700",
		bgColor: "bg-green-200",
		description: "Your order has been delivered successfully",
	},
	return_requested: {
		label: "Return Requested",
		icon: RotateCcw,
		color: "text-yellow-600",
		bgColor: "bg-yellow-100",
		description: "Return request has been initiated",
	},
	refunded: {
		label: "Refunded",
		icon: DollarSign,
		color: "text-blue-700",
		bgColor: "bg-blue-200",
		description: "Refund has been processed",
	},
	replaced: {
		label: "Replaced",
		icon: RefreshCw,
		color: "text-indigo-600",
		bgColor: "bg-indigo-100",
		description: "Replacement order has been processed",
	},
	cancelled: {
		label: "Cancelled",
		icon: X,
		color: "text-red-600",
		bgColor: "bg-red-100",
		description: "Order has been cancelled",
	},
};

export type OrderStatus = keyof typeof statusConfig;
type StatusState = "completed" | "current" | "next";

interface OrderStatusTimelineProps {
	currentStatus: OrderStatus;
}

export const OrderStatusTimeline = ({
	currentStatus,
}: OrderStatusTimelineProps) => {
	const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);

	// Only show statuses up to current status + 1 (to show next step)
	const visibleStatuses = ORDER_STATUS_FLOW.slice(0, currentIndex + 1);

	const getStatusState = (index: number): StatusState => {
		if (index < currentIndex) return "completed";
		if (index === currentIndex) return "current";
		return "next";
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<div className="relative">
				{visibleStatuses.map((status: OrderStatus, index: number) => {
					const config = statusConfig[status];
					const state = getStatusState(index);
					const isLast = index === visibleStatuses.length - 1;
					const isCurrent = index === currentIndex;

					return (
						<div key={status} className="relative flex items-start mb-6">
							{/* Timeline Line */}
							{!isLast && (
								<div
									className={`absolute left-6 top-12 w-0.5 h-10 ${
										state === "completed" ? "bg-green-400" : "bg-gray-300"
									}`}
								/>
							)}

							{/* Status Icon */}
							<div
								className={`
								relative  flex items-center justify-center w-12 h-12 rounded-full border-2
								${
									state === "completed"
										? "bg-green-500 border-green-500 text-white"
										: isCurrent
											? "bg-blue-100 text-blue-600 border-blue-600"
											: "bg-gray-100 border-gray-300 text-gray-400"
								}`}
							>
								{React.createElement(config.icon, { className: "w-5 h-5" })}
							</div>

							{/* Status Content */}
							<div className="ml-6 flex-1">
								<h4
									className={`
									font-semibold text-md
									${
										state === "completed"
											? "text-gray-800"
											: isCurrent
												? "text-blue-600"
												: "text-gray-500"
									}`}
								>
									{config.label}
								</h4>

								<p
									className={`
									mt-1 text-sm
									${
										state === "completed"
											? "text-gray-600"
											: isCurrent
												? "text-gray-700"
												: "text-gray-400"
									}`}
								>
									{config.description}
								</p>

								{/* Active indicator for current status */}
								{isCurrent && (
									<div className="mt-2 flex items-center gap-2">
										<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
										<span className="text-xs text-gray-500">
											Current Status
										</span>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
