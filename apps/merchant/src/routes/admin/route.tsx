import { useStore } from "@lipy/lib/hooks/use-store";

import {
  DashboardBody,
  DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import Loading from "@lipy/web-ui/components/ui/loading";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  CircleUser,
  LogOut,
  MapPin,
  Settings,
  Shirt,
  ShoppingBag,
  Store,
  Timer,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

// Navigation configuration
export const dashboardNav = {
  primary: [
    // {
    // 	label: "My Dashboard",
    // 	url: "/admin/",
    // 	icon: LayoutDashboard,
    // },
    { label: "Stores", url: "/admin/store", icon: Store },
    { label: "Review Products", url: "/admin/review-products", icon: Timer },

    { label: "Products", url: "/admin/product", icon: Shirt },
    { label: "Categories", url: "/admin/category", icon: ShoppingBag },
    { label: "Leads", url: "/admin/leads", icon: MapPin },
  ],
  secondary: [
    { label: "Account", url: "/account", icon: Settings },
    { label: "Sign out", url: "/logout", icon: LogOut },
  ],
};

const mobileNav = [
  // {
  // 	label: "Home",
  // 	url: "/admin",
  // 	icon: Home,
  // 	activeIcon: () => (
  // 		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
  // 		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  // 			<rect width="256" height="256" fill="none" />
  // 			<path d="M224,120v96a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V164a4,4,0,0,0-4-4H108a4,4,0,0,0-4,4v52a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z" />
  // 		</svg>
  // 	),
  // },
  { label: "Products", url: "/admin/product", icon: Shirt },
  { label: "Category", url: "/admin/category", icon: ShoppingBag },
  { label: "Account", url: "/account", icon: CircleUser },
];

function RouteComponent() {
  const { isPending } = useStore();
  return (
    <DashboardLayout
      dashboardNav={dashboardNav}
      mobileNav={mobileNav}
      logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
    >
      <DashboardBody>{isPending ? <Loading /> : <Outlet />}</DashboardBody>
    </DashboardLayout>
  );
}
