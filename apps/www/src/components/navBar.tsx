import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Link } from "@tanstack/react-router";
import { Building, ChevronDown, House, MapPin, UserRound } from "lucide-react";

export default function NavBar() {
	const { isMobile } = useViewport();
	const { deliveryLocation } = useLocationStore();

	// Mobile layout
	if (isMobile) {
		return (
			<div className="p-4 flex items-center justify-between ">
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

				<Link to="/account">
					<div className="py-1 px-2 rounded-full bg-black">
						<UserRound className="size-6 fill-background" />
					</div>
				</Link>
			</div>
		);
	}
}
