import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Link } from "@tanstack/react-router";
import { ChevronDown, MapPin, UserRound } from "lucide-react";

import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";

export default function NavBar() {
	const { isMobile } = useViewport();
	const { deliveryLocation } = useLocationStore();

	// Mobile layout
	if (isMobile) {
		return (
			<div className="p-4 flex items-center justify-between ">
				{deliveryLocation && (
					<div>
						<Link to="/account/addresses">
							<div className="text-lg font-bold flex items-center gap-2">
								<MapPin className="size-5 fill-primary" />
								<p className="truncate max-w-[250px] block">
									{deliveryLocation.addressName || "Locating"}
								</p>
								<ChevronDown className="size-5" />
							</div>
							<p className="text-sm">
								<span className="truncate max-w-[250px] block">
									{deliveryLocation.address}
								</span>
							</p>
						</Link>
					</div>
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
