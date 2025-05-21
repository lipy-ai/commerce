import NavBar from "@/components/navBar";
import NearByShops from "@/components/nearbyShops";
import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardBody,
  DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { CircleUser, LogOut, ShoppingCart, Store } from "lucide-react";
import LocationComponent from '@lipy/web-ui/components/maps/deliveryAddress'
import { SearchFilter } from "@/components/searchFilter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  {/* NavBar + SearchFilter with continuous gradient */}
  <div className="relative bg-gradient-to-b from-primary/50 to-primary/40">
    <NavBar />
     </div>
    
    <motion.div className="bg-gradient-to-b from-primary/40 to-white sticky top-0 z-20 shadow-sm transition-colors duration-300 backdrop-blur-lg"  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}>
      <SearchFilter />

    </motion.div>
 

  {/* Rest of the page */}
  <NearByShops />
  <LocationComponent />
</DashboardBody>
      </DashboardLayout>
    </>
  );
}
