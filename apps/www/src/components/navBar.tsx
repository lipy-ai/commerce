import { ScrollingTabs } from "@lipy/web-ui/components/custom-ui/scrollable-tabs";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Link } from "@tanstack/react-router";
import {
	Building,
	ChevronDown,
	CircleUserRound,
	House,
	MapPin,
	ShoppingCart,
	UserRound,
} from "lucide-react";
import { Cherry, Milk, Salad, ShoppingBasket, Store } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "./cart/store";

export default function NavBar() {
	const { isMobile } = useViewport();
	const { deliveryLocation } = useLocationStore();
	const [_, setActiveCategory] = useState("all");
	const { cart } = useCartStore();

	const CATEGORIES = [
		{ id: "all", name: "All Stores", icon: Store },
		{ id: "grocery", name: "Grocery", icon: ShoppingBasket },
		{ id: "fruits", name: "Fruits", icon: Cherry },
		{ id: "vegetables", name: "Vegetables", icon: Salad },
		{ id: "dairy", name: "Dairy", icon: Milk },
	];

	// Mobile layout

	if (isMobile) {
		return (
			<div className="relative  text-background bg-emerald-600  p-4 space-y-4">
				<div className="flex items-center justify-between ">
					{deliveryLocation && (
						<Link to={"/account/addresses/deliveryAddress"}>
							<div className="text-lg font-bold flex items-center gap-2">
								{deliveryLocation?.tag === "home" ? (
									<House className="size-5" />
								) : deliveryLocation?.tag === "work" ? (
									<Building className="size-5" />
								) : (
									<MapPin className="size-5" />
								)}
								<p className="truncate max-w-[250px] block">
									{deliveryLocation?.line1 === ""
										? "Locating"
										: (deliveryLocation?.tag ?? "").charAt(0).toUpperCase() +
											(deliveryLocation?.tag ?? "").slice(1)}
								</p>
								<ChevronDown className="size-5" />
							</div>
							<p className="text-sm">
								<span className="truncate max-w-[250px] block">
									{deliveryLocation.line1}
								</span>
							</p>
						</Link>
					)}

					<Link to="/account" viewTransition={{ types: ["slide-left"] }}>
						<div className="py-1 px-2 rounded-full bg-black">
							<UserRound className="size-6 fill-background" />
						</div>
					</Link>
				</div>

				<SearchBar />

				<div className="-mx-4 -mb-4">
					<ScrollingTabs
						tabs={CATEGORIES}
						handleTabChange={setActiveCategory}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 sticky top-0 z-50 shadow-sm bg-background">
			<div className="flex items-center  gap-8">
				<Link to="/" className="overflow-hidden">
					<img
						src={"/logo/logo.png"} // Replace with your logo path
						alt={"lipy-logo"}
						width={100}
						height={100}
						className="rounded-md"
					/>
				</Link>

				{deliveryLocation && (
					<Link to={"/account/addresses/deliveryAddress"}>
						<div className="text-xl font-bold flex items-center gap-2">
							{deliveryLocation?.tag === "home" ? (
								<House />
							) : deliveryLocation?.tag === "work" ? (
								<Building />
							) : (
								<MapPin />
							)}
							<p className="truncate max-w-[400px] block">
								{deliveryLocation?.line1 === ""
									? "Locating"
									: (deliveryLocation?.tag ?? "").charAt(0).toUpperCase() +
										(deliveryLocation?.tag ?? "").slice(1)}
							</p>
							<ChevronDown />
						</div>
						<p className="text-base">
							<span className="truncate max-w-[400px] block">
								{deliveryLocation.line1}
							</span>
						</p>
					</Link>
				)}
				<div className="w-full">
					<SearchBar />
				</div>
				<Link to="/account/orders">
					<CircleUserRound className="size-8" />
				</Link>
				<Link to="/cart" className={buttonVariants({ variant: "green" })}>
					<ShoppingCart className="size-8" />
					<p className="font-medium text-base">{cart.length} items</p>
				</Link>
			</div>
		</div>
	);
}
