import type { apiClient } from "@lipy/lib/api";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import {
	BrickWall,
	BriefcaseMedical,
	Cherry,
	Coffee,
	MapPin,
	Phone,
	Search,
	ShoppingBasket,
	Utensils,
} from "lucide-react";

const storeType = {
	pharmacy: {
		icon: BriefcaseMedical,
		label: "Pharmacy",
		color: "text-cyan-700",
	},
	grocery: {
		icon: ShoppingBasket,
		label: "Grocery",
		color: "text-amber-500",
	},
	fruits_and_vegetables: {
		icon: Cherry,
		label: "Fruits & Vegetables",
		color: "text-lime-500",
	},
	restaurant: {
		icon: Utensils,
		label: "Restaurant",
		color: "text-rose-500",
	},
	cafe: {
		icon: Coffee,
		label: "cafe",
		color: "text-amber-500",
	},
	hardware: {
		icon: BrickWall,
		label: "Hardware",
		color: "text-cyan-500",
	},
};
export const StoreHeroSection = ({
	storeInfo,
}: {
	storeInfo: InferResponseType<typeof apiClient.v1.shops.$get>[number];
}) => {
	const typeInfo = storeType[storeInfo?.type as keyof typeof storeType];
	return (
		<div className="space-y-2 lg:divide-y">
			<div className="bg-card lg:bg-background p-4 space-y-2">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<div
							className={cn(
								typeInfo?.color || "",
								"inline-flex items-center font-medium gap-1",
							)}
						>
							{typeInfo?.icon && (
								<span>
									<typeInfo.icon className="inline-block size-5" />
								</span>
							)}
							<p>{typeInfo?.label || ""}</p>
						</div>
						<h1 className="text-3xl font-bold">{storeInfo.name}</h1>
						<div className="inline-flex items-center gap-1  text-muted-foreground">
							<MapPin className="size-4 flex-shrink-0 stroke-2" />
							{[storeInfo?.address?.line2, storeInfo?.address?.city]
								.filter(Boolean)
								.join(", ")}
						</div>
					</div>
					<div>
						<a
							href={`tel:${storeInfo?.phone}`}
							className={cn(
								buttonVariants({ variant: "outline", size: "icon" }),
								"rounded-full",
							)}
						>
							<Phone className="text-ring size-5" />
						</a>
					</div>
				</div>

				<Link
					className={cn(
						buttonVariants({ variant: "tertiary" }),
						"w-full justify-start text-muted-foreground bg-tertiary/50",
					)}
					to="/$storeHandle/products/search"
					params={{ storeHandle: storeInfo?.handle || "" }}
				>
					<Search />
					Search in {storeInfo?.name}
				</Link>
			</div>
			{storeInfo?.type === "pharmacy" && (
				<div className="bg-card lg:bg-background flex gap-2 items-start justify-between p-4">
					<img
						src="/assets/prescription.svg"
						alt="prescription"
						className="size-16 object-cover bg-card"
					/>
					<div className="flex flex-col items-end mr-auto">
						<p className="font-semibold mr-auto">Order with prescription</p>
						<p className="text-muted-foreground text-xs">
							and let us arrange your medicines
						</p>
					</div>
					<Link
						to="/$storeHandle/order/new"
						params={{ storeHandle: storeInfo?.handle || "" }}
						className={cn(
							buttonVariants({ size: "sm" }),
							"mx-auto m-0 ml-auto mt-auto",
						)}
					>
						Order now
					</Link>
				</div>
			)}
		</div>
	);
};
