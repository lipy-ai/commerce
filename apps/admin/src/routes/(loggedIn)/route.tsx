import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  DashboardBody,
  DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import {
  CircleUser,
  Home,
  Layers2,
  LayoutDashboard,
  LogOut,
  Shirt,
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
      url: "/products",
      icon: Shirt,
      mobile: true,
    },
    {
      label: "Category",
      url: "/categories",
      icon: Layers2,
    },
    {
      label: "Merchants",
      url: "/merchants",
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
    url: "/products",
    icon: Shirt,
  },
  {
    label: "Categories",
    url: "/categories",
    icon: Layers2,
  },
  {
    label: "Merchant",
    url: "/merchants",
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
