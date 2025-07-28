import {
  DashboardBody,
  DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { Outlet } from "@tanstack/react-router";

import Loading from "@lipy/web-ui/components/ui/loading";
import {
  CircleUser,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Shirt,
  ShoppingBag,
  Users,
} from "lucide-react";
// Navigation configuration
export const dashboardNav = {
  primary: [
    {
      label: "My Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    { label: "Products", url: "/product", icon: Shirt },
    { label: "Orders", url: "/pos/order", icon: ShoppingBag },
    { label: "Customers", url: "/customer", icon: Users },
  ],
  secondary: [
    { label: "Account", url: "/account", icon: Settings },
    { label: "Sign out", url: "/logout", icon: LogOut },
  ],
};

const mobileNav = [
  {
    label: "Home",
    url: "/",
    icon: Home,
    activeIcon: () => (
      // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" />
        <path d="M224,120v96a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V164a4,4,0,0,0-4-4H108a4,4,0,0,0-4,4v52a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z" />
      </svg>
    ),
  },
  { label: "Products", url: "/product", icon: Shirt },
  { label: "Orders", url: "/pos/order", icon: ShoppingBag },
  { label: "Customers", url: "/customer", icon: Users },
  { label: "Account", url: "/account", icon: CircleUser },
];

export function DashboardNav() {
  return (
    <DashboardLayout
      dashboardNav={dashboardNav}
      mobileNav={mobileNav}
      logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
    >
      <DashboardBody>
        <Outlet />
      </DashboardBody>
    </DashboardLayout>
  );
}
