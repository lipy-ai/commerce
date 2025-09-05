import { publicShopApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import StoreCard from "./storeCard";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import EmptyPage from "@lipy/web-ui/components/pages/empty";

export default function NearbyShops({
  category,
  storeTypes,
}: {
  category?: string;
  storeTypes?: string[];
}) {
  const { deliveryLocation } = useLocationStore();

  const { data: shops, isLoading } = useAPIQuery(
    publicShopApi.index,
    "$get",
    {
      query: {
        originLat: String(deliveryLocation.lat),
        originLng: String(deliveryLocation.lng),

        category,
        storeTypes,
      },
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY,
      placeholderData: (p) => p,
      enabled: !!deliveryLocation.lat && !!deliveryLocation.lng,
    }
  );

  return (
    <div className="">
      {isLoading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      ) : shops?.length === 0 ? (
        <div>
          <EmptyPage
            title="No stores nearby."
            label="We could'nt find any shops available at your location."
            className="bg-muted/60 py-12 rounded-2xl"
          >
            <img
              src="/assets/no-results-found.png"
              alt=""
              className="aspect-square object-cover size-40 mb-8"
            />
          </EmptyPage>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {shops?.map((shop) => (
            <div key={shop.id} className="space-y-6">
              <StoreCard data={shop} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
