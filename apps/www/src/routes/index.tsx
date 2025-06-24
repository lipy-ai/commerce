import { AppCartInitializer } from "@/components/cart/appCartInitializer";
import { useCartStore } from "@/components/cart/store";
import NavBar from "@/components/navBar";
import NearByShops from "@/components/nearbyShops";
import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import LocationComponent from "@lipy/web-ui/components/maps/deliveryAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import {
	HomeIcon,
	// CircleUser,
	// LogOut,
	type LucideIcon,
	ShoppingCart,
	Store,
	UserCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { cart, initialized } = useCartStore();

	const { deliveryLocation, hasHydrated } = useLocationStore();
	const { isMobile } = useViewport();

	const mobileNav = [
		{
			label: "Home",
			url: "/",
			icon: HomeIcon,
			mobile: true,
		},

		{
			label: "Shops",
			url: "/shops",
			icon: Store,
			mobile: true,
		},
		{
			label: "Account",
			url: "/account",
			icon: UserCircle,
			mobile: true,
		},
		{
			label: "Cart",
			url: "/cart",
			icon: () => {
				return (
					<div className="relative inline-block">
						<ShoppingCart className="w-6 h-6 text-gray-700" />
						{cart.length > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
								{cart.length > 99 ? "99+" : cart.length}
							</span>
						)}
					</div>
				) as any as LucideIcon;
			},
			mobile: true,
		} as any,
	];

	return (
		<>
			<DashboardLayout
				mobileNav={mobileNav}
				logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
			>
				<DashboardBody>
					{isMobile && <NavBar />}
					<NearByShops />

					{hasHydrated && deliveryLocation.line1 === "" && (
						<LocationComponent />
					)}

					{!initialized && <AppCartInitializer />}
				</DashboardBody>
			</DashboardLayout>
		</>
	);
}
