import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  DashboardBody,
  DashboardLayout,
} from "@web-ui/components/layouts/dashboard";
import {
  CircleUser,
  GitPullRequest,
  Layers2,
  LayoutDashboard,
  LogOut,
  Shirt,
  Users,
} from "lucide-react";
export const Route = createFileRoute("/(loggedIn)")({
  component: RouteComponent,
});

export const dashboardNavs = {
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

function RouteComponent() {
  return (
    <DashboardLayout
      navs={dashboardNavs}
      logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
    >
      <DashboardBody>
        <Outlet />
      </DashboardBody>
    </DashboardLayout>
  );
}
