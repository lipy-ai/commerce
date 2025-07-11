import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Link } from "@tanstack/react-router";
import {
	Building,
	ChevronDown,
	CircleUserRound,
	House,
	MapPin,
	UserRound,
} from "lucide-react";

import { CartInDesktop } from "./cart/cartInDesktop";

export default function NavBar() {
	const { isMobile } = useViewport();
	const { deliveryLocation } = useLocationStore();
	// Mobile layout

	if (isMobile) {
		return (
			<div className="relative  text-background bg-card p-4 space-y-4">
				<div className="flex items-center justify-between text-foreground">
					{deliveryLocation && (
						<Link to={"/account/addresses/deliveryAddress"}>
							<div className="flex items-center gap-2">
								{<MapPin className="fill-secondary/60" />}
								<p className="truncate max-w-[250px] font-bold text-lg">
									{deliveryLocation?.line1 === ""
										? "Locating"
										: (deliveryLocation?.tag ?? "").charAt(0).toUpperCase() +
											(deliveryLocation?.tag ?? "").slice(1)}
								</p>
								<ChevronDown className="size-5" />
							</div>
							<p className="truncate max-w-[250px] block font-normal">
								{[deliveryLocation?.metadata?.building, deliveryLocation?.line1]
									.filter(Boolean)
									.join(", ")}
							</p>
						</Link>
					)}

					<Link to="/account" viewTransition={{ types: ["slide-left"] }}>
						<div className="py-1 px-2 rounded-full bg-black">
							<UserRound className="size-6 fill-background" />
						</div>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="sticky top-0 z-100  bg-background">
			<div className="px-16 p-6 bg-accent/20 ">
				<div className="flex items-center  gap-8">
					<Link to="/" className="overflow-hidden">
						<img
							src={"/logo/logo.png"} // Replace with your logo path
							alt={"lipy-logo"}
							width={100}
							height={200}
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
							{deliveryLocation.line1 !== "" && (
								<p className="text-base">
									<span className="truncate max-w-[400px] block">
										{[
											deliveryLocation?.name,
											deliveryLocation?.metadata?.building,
											deliveryLocation?.line1,
										]
											.filter(Boolean)
											.join(", ")}
									</span>
								</p>
							)}
						</Link>
					)}
					<div className="w-full px-2">
						<SearchBar
							placeholder="Search for shop, grocery, fruits..."
							defaultValue=""
						/>
					</div>
					<Link to="/account">
						<CircleUserRound className="size-8" />
					</Link>
					<CartInDesktop />
				</div>
			</div>
		</div>
	);
}
