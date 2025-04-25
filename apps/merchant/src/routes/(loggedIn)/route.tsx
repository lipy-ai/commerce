import { createFileRoute, Outlet } from "@tanstack/react-router";

import {
  DashboardBody,
  DashboardLayout,
} from "@web-ui/components/layouts/dashboard";

import {
  CircleUser,
  Home,
  LayoutDashboard,
  LogOut,
  Shirt,
  ShoppingBag,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/(loggedIn)")({
  component: RouteComponent,
});

export const dashboardNav = {
  primary: [
    {
      label: "My Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      url: "/product",
      icon: Shirt,
      mobile: true,
    },
    {
      label: "Orders",
      url: "/order",
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      url: "/customer",
      icon: Users,
    },
  ],
  secondary: [
    {
      label: "Account",
      url: "/account",
      icon: CircleUser,
    },
    { label: "Sign out", url: "/logout", icon: LogOut },
    // { label: "Help", url: "/help", icon: CircleHel },
  ],
};

const mobileNav = [
  {
    label: "Home",
    url: "/",
    icon: Home,
  },
  {
    label: "Products",
    url: "/product",
    icon: Shirt,
  },
  {
    label: "Orders",
    url: "/order",
    icon: ShoppingBag,
  },
  {
    label: "Customers",
    url: "/customer",
    icon: Users,
  },

  {
    label: "Account",
    url: "/account",
    icon: CircleUser,
  },
];

function RouteComponent() {
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
