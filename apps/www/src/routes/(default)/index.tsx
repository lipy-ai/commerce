import {
  DashboardBody,
  DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import {
  HomeIcon,
  type LucideIcon,
  ShoppingBag,
  ShoppingCart,
  Store,
} from "lucide-react";
import { AppCartInitializer } from "@/components/cart/appCartInitializer";
import { useCartStore } from "@/components/cart/store";
import NavBar from "@/components/navBar";
import NearByShops from "@/components/nearbyShops";

export const Route = createFileRoute("/(default)/")({
  component: Home,
});

function Home() {
  const { cart, initialized } = useCartStore();

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
      label: "Orders",
      url: "/account/orders",
      icon: ShoppingBag,
      mobile: true,
    },
    {
      label: "Cart",
      url: "/cart",
      icon: () => {
        return (
          <div className="relative inline-block">
            <ShoppingCart className="w-6 h-6 " />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
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
    <DashboardLayout
      mobileNav={mobileNav}
      logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
    >
      <DashboardBody>
        <NavBar />
        <NearByShops />

        {!initialized && <AppCartInitializer />}
      </DashboardBody>
    </DashboardLayout>
  );
}
