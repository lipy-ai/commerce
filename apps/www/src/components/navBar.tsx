import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Link } from "@tanstack/react-router";
import {
  Building,
  ChevronDown,
  CircleUserRound,
  House,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { AddressSetter } from "@/components/address/addressSetter";
import { CartInDesktop } from "./cart/cartInDesktop";

export default function NavBar() {
  const { isMobile } = useViewport();
  const { deliveryLocation } = useLocationStore();
  // Mobile layout

  if (isMobile) {
    return (
      <div className="relative  text-background bg-card p-4 space-y-4">
        <div className="flex items-center justify-between text-foreground">
          <AddressSetter>
            {deliveryLocation && (
              <div>
                <div className="flex items-center gap-2">
                  {<MapPin className="fill-secondary/60" />}
                  <p className="truncate max-w-[250px] font-bold text-lg capitalize">
                    {deliveryLocation?.line1 === ""
                      ? "Locating"
                      : deliveryLocation?.tag}
                  </p>
                  <ChevronDown className="size-5" />
                </div>
                <p className="truncate max-w-[250px] block font-normal">
                  {[
                    deliveryLocation?.metadata?.building,
                    deliveryLocation?.line1,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
          </AddressSetter>

          <Link to="/account" viewTransition={{ types: ["slide-left"] }}>
            <div className="py-1 px-2 rounded-full bg-black">
              <UserRound className="size-6 fill-background" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0   bg-background border-b z-10">
      <div className="px-16 p-6 bg-accent/20 ">
        <div className="flex items-center  gap-8">
          <Link to="/">
            <img
              src={"/logo/logo.png"}
              alt={"lipy-logo"}
              className="w-36 h-12 rounded-md flex-shrink-0 aspect-square object-cover"
            />
          </Link>

          <AddressSetter>
            {deliveryLocation && (
              <div className="max-w-[400px] cursor-pointer">
                <div className="text-xl font-bold flex items-center gap-2">
                  {deliveryLocation?.tag === "home" ? (
                    <House />
                  ) : deliveryLocation?.tag === "work" ? (
                    <Building />
                  ) : (
                    <MapPin />
                  )}
                  <p className="truncate  block capitalize">
                    {deliveryLocation?.line1 === ""
                      ? "Locating"
                      : (deliveryLocation?.tag ?? "")}
                  </p>
                  <ChevronDown />
                </div>
                {deliveryLocation.line1 !== "" && (
                  <p className="text-base">
                    <span className="truncate max-w-[400px] block">
                      {[
                        deliveryLocation?.name,
                        deliveryLocation?.metadata?.building,
                        deliveryLocation?.line1,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </p>
                )}
              </div>
            )}
          </AddressSetter>

          <div className="w-full px-2">
            <Link
              to="/search"
              className="h-12 flex flex-1 text-base items-center gap-2 px-4 border rounded-lg bg-background"
            >
              <Search />
              <span>Search Shops</span>
            </Link>
          </div>
          <Link to="/account">
            <CircleUserRound className="size-8" />
          </Link>
          <CartInDesktop />
        </div>
      </div>
    </div>
  );
}
