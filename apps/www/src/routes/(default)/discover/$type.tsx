import NavBar from "@/components/navBar";
import NearbyShops from "@/components/shops/nearbyShops";
import {
  FOOD_CATEGORIES,
  GENERAL_CATEGORIES,
  WELLNESS_CATEGORIES,
} from "@/utils/config";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@lipy/web-ui/components/ui/carousel";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { cn } from "@lipy/web-ui/lib/utils";

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/(default)/discover/$type")({
  component: RouteComponent,
  loader: (ctx) => {
    const { type } = ctx.params;
    let categories = null;
    if (type === "food") {
      categories = FOOD_CATEGORIES;
    }
    if (type === "everyday-products") {
      categories = GENERAL_CATEGORIES;
    }
    if (type === "pharma-and-wellness") {
      categories = WELLNESS_CATEGORIES;
    }

    if (!categories) throw notFound();
    return { categories };
  },
  validateSearch: z.object({ category: z.string().optional() }),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { type } = Route.useParams();
  const { category } = Route.useSearch();

  return (
    <>
      <NavBar />
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-4 w-full">
        {type === "food" && (
          <>
            <div className="">
              <Carousel
                opts={{
                  dragFree: true,
                }}
                className="relative"
              >
                <CarouselPrevious className="absolute -left-5 top-1/3 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute -right-5 top-1/3 -translate-y-1/2 z-10" />

                <CarouselContent className="">
                  {/* <CarouselNext /> */}
                  {data?.categories?.map((c, i) => (
                    <CarouselItem
                      key={i}
                      className="basis-1/4 sm:basis-1/10 md:basis-1/12 flex flex-col pl-0"
                    >
                      <Link
                        key={c.id}
                        className={cn(
                          "block p-2 border-3 rounded-lg border-transparent overflow-hidden",
                          category === c.id && "border-primary"
                        )}
                        to="/discover/$type"
                        params={{ type }}
                        search={{
                          category: c.id,
                        }}
                      >
                        <div>
                          <img src={c.image} alt={c.alt} />
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <Separator />
          </>
        )}
        <div className="space-y-8 mt-8">
          <h1 className="text-xl font-medium">
            Nearby{" "}
            {type === "food"
              ? "Restaurants, Cafes & Hotels"
              : type === "everyday-products"
                ? "General stores"
                : type === "pharma-and-wellness"
                  ? "Pharmacy and Wellness stores"
                  : "stores"}
          </h1>
          <NearbyShops
            category={category}
            storeTypes={
              type === "food"
                ? ["restaurant", "cafe"]
                : type === "everyday-products"
                  ? ["fruits_and_vegetables", "grocery", "hardware"]
                  : type === "pharma-and-wellness"
                    ? ["pharmacy"]
                    : undefined
            }
          />
        </div>
      </div>
    </>
  );
}

// export function CarouselOrientation() {
//   return (
//     <Carousel
//       opts={{
//         align: "start",
//       }}
//       orientation="vertical"
//       className="w-full max-w-xs"
//     >
//       <CarouselContent className="-mt-1 h-[200px]">
//         {Array.from({ length: 5 }).map((_, index) => (
//           <CarouselItem key={index} className="pt-1 md:basis-1/2">
//             <div className="p-1">

//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       {/* <CarouselPrevious />
//       <CarouselNext /> */}
//     </Carousel>
//   )
// }
