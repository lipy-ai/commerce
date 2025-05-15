import NavBar from "@/components/navBar";
import NearByShops from "@/components/nearbyShops";
import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardBody,
  DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { CircleUser, LogOut, ShoppingCart, Store } from "lucide-react";
export const Route = createFileRoute("/")({
  component: Home,
});

export const dashboardNav = {
  primary: [
    {
      label: "Shops Near me",
      url: "/",
      icon: Store,
    },
    {
      label: "Cart",
      url: "/account/profile",
      icon: ShoppingCart,
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
    label: "Shops Near me",
    url: "/",
    icon: Store,
  },
  {
    label: "Cart",
    url: "/account/profile",
    icon: ShoppingCart,
  },
];

const shops = [
  {
    id: "1",
    name: "Fresh Mart",
    image: "/assets/paper-bag-items.webp",
    rating: 4.7,
    distance: "500m",
    status: "Open",
  },
  {
    id: "2",
    name: "Grocery World",
    image: "/assets/paper-bag-items.webp",
    rating: 4.2,
    distance: "1.2km",
    status: "Closed",
  },
  {
    id: "3",
    name: "Daily Needs",
    image: "/assets/paper-bag-items.webp",
    rating: 4.9,
    distance: "850m",
    status: "Open",
  },
];
function Home() {
  return (
    <>
      <DashboardLayout
        dashboardNav={dashboardNav}
        mobileNav={mobileNav}
        logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
      >
        <DashboardBody>
          <NavBar />
          <NearByShops />
        </DashboardBody>
      </DashboardLayout>
    </>
  );
}
