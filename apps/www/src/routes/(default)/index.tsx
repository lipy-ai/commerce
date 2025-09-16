// import {personal-care_and_17_others
//   DashboardBody,
//   DashboardLayout,
// } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Search,
  ShoppingCart,
  User2,
} from "lucide-react";
// import { AppCartInitializer } from "@/components/cart/appCartInitializer";
import { useCartStore } from "@/components/cart/store";
// import NavBar from "@/components/navBar";
// import NearByShops from "@/components/nearbyShops";
import { Footer } from "../(public)/-footer";
import { AddressSetter } from "../../components/address/addressSetter";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";

import { cn } from "@lipy/web-ui/lib/utils";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { authClient } from "@lipy/lib/providers/auth";
// import { useViewport } from "@lipy/web-ui/contexts/viewport";
import NearbyShops from "@/components/shops/nearbyShops";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@lipy/web-ui/components/ui/carousel";
import {
  FOOD_CATEGORIES,
  // GENERAL_CATEGORIES,
  // WELLNESS_CATEGORIES,
} from "@/utils/config";

export const Route = createFileRoute("/(default)/")({
  component: Home,
});

function Home() {
  const { cart } = useCartStore();
  const { deliveryLocation } = useLocationStore();
  const { data: sess } = authClient.useSession();
  // const { isMobile } = useViewport();

  // const mobileNav = [
  //   {
  //     label: "Home",
  //     url: "/",
  //     icon: HomeIcon,
  //     mobile: true,
  //   },
  //   {
  //     label: "Orders",
  //     url: "/account/orders",
  //     icon: ShoppingBag,
  //     mobile: true,
  //   },
  //   {
  //     label: "Cart",
  //     url: "/cart",
  //     icon: () => {
  //       return (
  //         <div className="relative inline-block">
  //           <ShoppingCart className="w-6 h-6 " />
  //           {cart.length > 0 && (
  //             <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
  //               {cart.length > 99 ? "99+" : cart.length}
  //             </span>
  //           )}
  //         </div>
  //       ) as any as LucideIcon;
  //     },
  //     mobile: true,
  //   } as any,
  // ];

  return (
    <>
      {/* <DashboardLayout
        mobileNav={mobileNav}
        logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
      >
        <DashboardBody>
          <NavBar />

          <NearByShops />
          {!initialized && <AppCartInitializer />}
        </DashboardBody>
      </DashboardLayout> */}
      <div className="md:p-2">
        <div className="bg-gradient-to-b from-[#1F58CB] to-[#073A9F] min-h-[600px] 2xl:min-h-[800px] relative p-8 md:rounded-2xl w-full m-auto overflow-hidden">
          <div className="absolute top-[400px] sm:top-[100px] 2xl:top-[150px] h-[450px] sm:h-[800px] 2xl:h-[1000px] rotate-45 -right-54 sm:-right-84">
            <img
              src="/assets/pizza-bg.webp"
              alt="pizza"
              className="size-full object-contain"
            />
          </div>
          <div className="absolute top-[500px] sm:top-[300px] rotate-45 h-[300px] sm:h-[600px] -left-24 sm:-left-32">
            <img
              src="/assets/grocery.webp"
              alt="grocery-bag"
              className="size-full object-contain"
            />
          </div>
          <div className="max-w-7xl m-auto relative z-10 drop-shadow-2xl">
            <header className="m-auto w-full flex justify-between">
              <Link to="/">
                <img src="/logo/lipy.webp" alt="Lipy" className="h-8" />
              </Link>
              <div className="text-xl flex items-center gap-4">
                {!sess?.session.token ? (
                  <Link
                    to="/login"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-full px-8 h-10"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      Signin <ArrowUpRight className="size-5" />
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/account"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                        "rounded-full h-10"
                      )}
                    >
                      <User2 className="size-5" />
                    </Link>
                    <Link
                      to="/cart"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "text-lg rounded-full px-8  h-10"
                      )}
                    >
                      <ShoppingCart className="size-5" />
                      <span className="flex items-center gap-2">
                        {!cart ? "Cart" : `${cart.length} Items`}
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </header>
            <div className="flex flex-col gap-12 py-24">
              <h1 className="font-semibold text-center text-2xl sm:text-5xl text-white flex-1 w-full max-w-4xl m-auto leading-tight tracking-wide">
                Order food, groceries & medicines. Discover local stores. Lipy
                it!
              </h1>
              <div className="flex gap-4 sm:gap-8 max-w-3xl flex-col sm:flex-row w-full flex-1 m-auto">
                <AddressSetter>
                  <div className="bg-white p-4 flex gap-2 items-center w-full sm:max-w-54 rounded-xl h-15">
                    <MapPin className="shrink-0" />
                    <p className="truncate block font-normal text-lg">
                      {deliveryLocation?.line1
                        ? [
                            deliveryLocation?.metadata?.building,
                            deliveryLocation?.line1,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : "Delivery location"}
                    </p>
                    <ChevronDown className="size-6 shrink-0" />
                  </div>
                </AddressSetter>
                <Link
                  to="/search"
                  className="h-15 border bg-background flex gap-2 p-4 items-center rounded-xl text-lg flex-1"
                >
                  <Search />
                  <span>Search shops...</span>
                </Link>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div className="my-12 flex flex-col gap-y-4 sm:gap-y-12">
        <div className="max-w-5xl space-y-8 w-full m-auto p-4">
          <h1 className="text-2xl">Nearby Stores</h1>
          <NearbyShops />
        </div>
        <div className="grid grid-cols-3 max-w-5xl m-auto gap-2 sm:gap-4 p-4 [&_img]:rounded-xl">
          <Link to="/discover/$type" params={{ type: "food" }}>
            <img
              src="/assets/banners/food-banner.webp"
              alt="Order food form you favourite local store just on lipy."
            />
          </Link>
          <Link to="/discover/$type" params={{ type: "everyday-products" }}>
            <img
              src="/assets/banners/grocery-banner.webp"
              alt="Order food form you favourite local store just on lipy."
            />
          </Link>
          <Link to="/discover/$type" params={{ type: "pharma-and-wellness" }}>
            <img
              src="/assets/banners/medicines-banner.webp"
              alt="Order food form you favourite local store just on lipy."
            />
          </Link>
        </div>
        <div className="max-w-5xl space-y-8 p-4 m-auto">
          <div className="">
            <Carousel
              opts={{
                dragFree: true,
              }}
            >
              <div className="flex gap-2 justify-between mb-8">
                <h1 className="text-2xl">Discover Food</h1>
                <div className="gap-2 flex">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </div>
              <CarouselContent>
                {Array.from(
                  { length: Math.ceil(FOOD_CATEGORIES.length / 2) },
                  (_, i) => FOOD_CATEGORIES.slice(i * 2, i * 2 + 2)
                ).map((c, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-1/4 sm:basis-1/6 md:basis-1/8 pl-2 sm:pl-4 flex flex-col gap-6 sm:gap-8"
                  >
                    {c.map((d) => (
                      <Link
                        key={d.id}
                        className="block"
                        to="/discover/$type"
                        params={{ type: "food" }}
                        search={{ category: d.id }}
                      >
                        <div>
                          <img
                            src={`/assets/food-category/${d.id}.webp`}
                            alt={d.id}
                          />
                        </div>
                      </Link>
                    ))}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        {/* <div className="max-w-5xl space-y-8 p-4 m-auto">
          <div className="">
            <Carousel
              opts={{
                dragFree: true,
              }}
            >
              <div className="flex gap-2 justify-between mb-8">
                <h1 className="text-2xl">Discover Everyday Products</h1>
                <div className="gap-2 flex">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </div>
              <CarouselContent className="">
                {GENERAL_CATEGORIES.map((c, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-1/4 sm:basis-1/6 pl-2 sm:pl-4 md:basis-1/8 flex flex-col gap-6 sm:gap-8"
                  >
                    <Link
                      key={c.id}
                      className="block"
                      to="/category/$slug"
                      params={{ slug: c.id }}
                    >
                      <div>
                        <img
                          src={`/assets/grocery-category/${c.id}.webp`}
                          alt={c.id}
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        <div className="max-w-5xl space-y-8 p-4 m-auto">
          <div className="">
            <Carousel
              opts={{
                dragFree: true,
              }}
            >
              <div className="flex gap-2 justify-between mb-8">
                <h1 className="text-2xl">Discover Pharma & Wellness</h1>
                <div className="gap-2 flex">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </div>
              <CarouselContent className="">
                {Array.from(
                  { length: Math.ceil(WELLNESS_CATEGORIES.length / 2) },
                  (_, i) => WELLNESS_CATEGORIES.slice(i * 2, i * 2 + 2)
                ).map((c, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-1/4 sm:basis-1/6 md:basis-1/8 pl-2 sm:pl-4 flex flex-col gap-6 sm:gap-8"
                  >
                    {c.map((d) => (
                      <Link
                        key={d.id}
                        className="block"
                        to="/category/$slug"
                        params={{ slug: d.id }}
                      >
                        <div>
                          <img
                            src={`/assets/medicine-category/${d.id}.webp`}
                            alt={d.id}
                          />
                        </div>
                      </Link>
                    ))}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div> */}
      </div>
      <br />
      <br /> <br /> <br /> <br />
      <Footer />
    </>
  );
}

// import {
//   DashboardBody,
//   DashboardLayout,
// } from "@lipy/web-ui/components/layouts/dashboard";
// import { createFileRoute } from "@tanstack/react-router";
// import {
//   HomeIcon,
//   type LucideIcon,
//   ShoppingBag,
//   ShoppingCart,
// } from "lucide-react";
// import { AppCartInitializer } from "@/components/cart/appCartInitializer";
// import { useCartStore } from "@/components/cart/store";
// import NavBar from "@/components/navBar";
// import { Footer } from "../(public)/-footer";
// import { publicShopApi } from "@lipy/lib/api";
// import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
// import { ScrollingTabs } from "@lipy/web-ui/components/custom-ui/scrollable-tabs";
// import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
// import EmptyPage from "@lipy/web-ui/components/pages/empty";
// import { buttonVariants } from "@lipy/web-ui/components/ui/button";
// import Loading from "@lipy/web-ui/components/ui/loading";
// import { useViewport } from "@lipy/web-ui/contexts/viewport";
// import { cn } from "@lipy/web-ui/lib/utils";
// import { Link } from "@tanstack/react-router";
// import { Bike, Dot, Search } from "lucide-react";
// import { useState } from "react";

// export const Route = createFileRoute("/(default)/")({
//   component: Home,
// });

// function Home() {
//   const { cart, initialized } = useCartStore();

//   const mobileNav = [
//     {
//       label: "Home",
//       url: "/",
//       icon: HomeIcon,
//       mobile: true,
//     },
//     {
//       label: "Orders",
//       url: "/account/orders",
//       icon: ShoppingBag,
//       mobile: true,
//     },
//     {
//       label: "Cart",
//       url: "/cart",
//       icon: () => {
//         return (
//           <div className="relative inline-block">
//             <ShoppingCart className="w-6 h-6 " />
//             {cart.length > 0 && (
//               <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
//                 {cart.length > 99 ? "99+" : cart.length}
//               </span>
//             )}
//           </div>
//         ) as any as LucideIcon;
//       },
//       mobile: true,
//     } as any,
//   ];

//   return (
//     <>
//       <DashboardLayout
//         mobileNav={mobileNav}
//         logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
//       >
//         <DashboardBody>
//           <NavBar />
//           {/* <Category /> */}
//           <NearByShops />
//           {!initialized && <AppCartInitializer />}
//         </DashboardBody>
//       </DashboardLayout>
//       <Footer />
//     </>
//   );
// }

// const CATEGORIES = [
//   { id: "all", name: "All", src: "/assets/food/all-food.png" },
//   { id: "biryani", name: "Biryani", src: "/assets/food/biryani.png" },
//   { id: "pizza", name: "Pizza", src: "/assets/food/pizza.png" },
//   { id: "burger", name: "Burger", src: "/assets/food/burger.png" },
//   { id: "thali", name: "Thali", src: "/assets/food/thali.png" },
//   { id: "dosa", name: "Dosa", src: "/assets/food/dosa.png" },
// ];

// export default function NearByShops() {
//   const [activeCategory, setActiveCategory] = useState("all");
//   const { isMobile } = useViewport();
//   const { deliveryLocation } = useLocationStore();
//   const { data: shops, isFetching } = useAPIQuery(
//     publicShopApi.index,
//     "$get",
//     {
//       query: {
//         originLat: String(deliveryLocation.lat),
//         originLng: String(deliveryLocation.lng),
//       },
//     },
//     {
//       staleTime: Number.POSITIVE_INFINITY,
//       cacheTime: Number.POSITIVE_INFINITY,
//       placeholderData: (p) => p,
//       enabled: !!deliveryLocation.lat && !!deliveryLocation.lng,
//     }
//   );

//   const filteredShops =
//     shops?.filter((shop) => {
//       const matchesCategory =
//         activeCategory === "all" || shop.type === activeCategory;
//       return matchesCategory;
//     }) || [];
//   return (
//     <>
//       {isMobile ? (
//         <div className=" border-b sticky top-0 z-50 bg-card  overflow-hidden shadow-xs">
//           <div className="relative z-10 space-y-2">
//             <div className="px-4 py-1">
//               <Link
//                 to="/search"
//                 className={cn(
//                   buttonVariants({ variant: "outline" }),
//                   "w-full rounded-lg shadow-xs flex justify-start"
//                 )}
//               >
//                 <Search className="size-5 mr-1 stroke-2" />
//                 Search for products
//               </Link>
//             </div>

//             <div>
//               <ScrollingTabs
//                 tabs={CATEGORIES}
//                 handleTabChange={(id) => setActiveCategory(id)}
//                 className="text-foreground "
//               />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="sticky top-0 bg-background border-b">
//           <div className="bg-accent/20 px-12">
//             <ScrollingTabs
//               tabs={CATEGORIES}
//               handleTabChange={(id) => setActiveCategory(id)}
//               className="text-foreground"
//             />
//           </div>
//         </div>
//       )}

//       {isFetching ? (
//         <Loading />
//       ) : !shops || filteredShops.length === 0 ? (
//         <EmptyPage
//           title="Coming soon to your doorstep!"
//           label="We are currently not available at your location. We will be in your
// 					service soon."
//         >
//           <img
//             src="/assets/online-shopping-store.png"
//             alt=""
//             className="aspect-square object-cover size-40"
//           />
//         </EmptyPage>
//       ) : filteredShops.length === 0 ? (
//         <EmptyPage title="No shop found">
//           <img
//             src="/assets/no-results-found.png"
//             alt=""
//             className="aspect-square object-cover size-40"
//           />
//         </EmptyPage>
//       ) : (
//         <div>
//           <div className="m-auto  px-2 lg:px-16">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4 py-4">
//               {filteredShops.map((shop) => (
//                 <div key={shop.id} className="space-y-6">
//                   <div className="bg-card border p-0 rounded-xl  shadow-sm">
//                     <Link
//                       to="/$storeHandle"
//                       params={{ storeHandle: shop.handle as string }}
//                     >
//                       <div className="relative h-40 lg:h-44">
//                         <img
//                           src={shop.image || "/assets/paper-bag-items.webp"}
//                           alt={shop.name}
//                           className="size-full object-cover rounded-t-xl bg-accent/30"
//                         />
//                         {shop.freeDeliveryDistance > 0 && (
//                           <div className="absolute bottom-2 right-2 backdrop-blur-md bg-black/30 text-white  rounded-md flex items-center gap-1 text-xs px-1.5 py-0.5">
//                             <Bike className="size-3 stroke-2 text-blue-400" />
//                             <p>
//                               Free delivery within {shop.freeDeliveryDistance}{" "}
//                               km
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                       <div className="p-3">
//                         <div className="flex gap-2 justify-between items-start">
//                           <h3 className="text-xl font-bold line-clamp-2 break-words">
//                             {shop.name}
//                           </h3>
//                           <p className="capitalize bg-tertiary/60  p-0.5 rounded-lg px-1">
//                             {shop.type}
//                           </p>
//                         </div>

//                         <div className="flex items-center gap-0 text-muted-foreground">
//                           <p>{shop.address?.line2 || shop.address?.city}</p>

//                           <Dot className="fill-muted-foreground" />
//                           <p>{shop.distance.text}</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
