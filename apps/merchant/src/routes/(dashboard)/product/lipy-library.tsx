// import { merchantComboboxApi, merchantProductApi } from "@lipy/lib/api";
// import { scrollToElementHorizontal } from "@lipy/lib/utils/scroll";
// import { apiQueryOptions, useAPIQuery } from "@lipy/lib/utils/useQueryClient";
// import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
// import {
//   DashboardHeader,
//   useLayout,
// } from "@lipy/web-ui/components/layouts/dashboard";
// import { Pagination } from "@lipy/web-ui/components/pages/pagination";
// import { Button } from "@lipy/web-ui/components/ui/button";
// import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
// import { Label } from "@lipy/web-ui/components/ui/label";
// import Loading from "@lipy/web-ui/components/ui/loading";
// import { cn } from "@lipy/web-ui/lib/utils";
// import { useQueryClient } from "@tanstack/react-query";
// import { createFileRoute } from "@tanstack/react-router";
// import type { InferResponseType } from "hono";
// import { produce } from "immer";
// import { CheckCircle, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { z } from "zod";
// export const Route = createFileRoute("/(dashboard)/product/lipy-library")({
//   component: RouteComponent,
//   validateSearch: z.object({
//     page: z.coerce.number().int().min(1).catch(1).default(1),
//     q: z.string().default(""),
//     category: z.string().optional(),
//     product: z.string().uuid().optional(),
//     view: z.enum(["edit", "assign", "delete", "create"]).optional(),
//   }),
// });

// type Response = InferResponseType<typeof merchantProductApi.index.$get>;

// function RouteComponent() {
//   const { page, q, category } = Route.useSearch();
//   const { addFooter, removeFooter } = useLayout();
//   const queryClient = useQueryClient();
//   const navigate = Route.useNavigate();

//   const query = {
//     page: String(page),
//     limit: String(10),
//     q,
//     showAll: "true",
//     category,
//     globalOnly: "true",
//   };
//   const { data, isLoading } = useAPIQuery(
//     merchantProductApi.index,
//     "$get",
//     {
//       query,
//     },
//     {
//       placeholderData: (p) => p,
//     }
//   );
//   const { data: categories, isLoading: isLoadingCategories } = useAPIQuery(
//     merchantComboboxApi.index,
//     "$get",
//     {
//       query: {
//         type: "categories",
//       },
//     }
//   );

//   const opts = {
//     onMutate({ json }: { json: any }) {
//       queryClient.setQueryData(
//         apiQueryOptions(merchantProductApi.index, "$get", {
//           query,
//         }).queryKey,
//         (prev: typeof data) =>
//           produce(prev, (draft) => {
//             if (!draft) return draft;

//             let variantIdx = -1;
//             const productIdx = draft.items.findIndex((product) => {
//               const idx = product.variants?.findIndex(
//                 (variant) => variant.id === json.variantId
//               );
//               if (Number(idx) >= 0) {
//                 variantIdx = idx;
//                 return true;
//               }
//               return false;
//             });
//             if (productIdx !== -1 && variantIdx !== -1) {
//               const variant = draft.items[productIdx].variants[variantIdx];
//               draft.items[productIdx].variants[variantIdx] =
//                 json.operation !== "delete"
//                   ? {
//                       ...variant,
//                       inventoryId: json.id,
//                       storePrice: Number(json.price),
//                       stock: Number(json.stock),
//                       sku: json.sku || null,
//                     }
//                   : {
//                       ...variant,
//                       storePrice: null,
//                       stock: null,
//                       sku: null,
//                       inventoryId: null,
//                     };
//             }

//             return draft;
//           })
//       );
//     },

//     onSuccess() {
//       toast.success("Operation successful");
//     },
//     onError(err: any) {
//       console.error(err);
//     },
//   };

//   const [updates, setUpdates] = useState<Response["items"][0]["variants"]>([]);

//   const SaveBtn = () => (
//     <Card className="">
//       <CardContent className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 drop-shadow">
//         <div className="flex gap-4 w-full md:w-auto">
//           <Button className="flex-1">
//             <CheckCircle />
//             Save {updates.length} Changes
//           </Button>

//           <Button
//             className="flex-1"
//             // size={"icon"}
//             variant={"outline"}
//             onClick={() => setUpdates([])}
//           >
//             <XCircle /> Clear
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   useEffect(() => {
//     if (updates.length > 0) {
//       addFooter({ id: "save-btn", node: <SaveBtn /> });
//     } else {
//       removeFooter("save-btn");
//     }
//     return () => {
//       removeFooter("save-btn");
//     };
//   }, [updates]);

//   const scrollByAmount = (direction: "left" | "right") => {
//     const container = document.getElementById("categories");
//     if (!container) return;

//     const scrollAmount = 1600; // px to scroll each click
//     container.scrollBy({
//       left: direction === "right" ? scrollAmount : -scrollAmount,
//       behavior: "smooth",
//     });
//   };

//   if (isLoadingCategories) return <Loading />;

//   return (
//     <div>
//       <DashboardHeader title="Lipy library" />

//       <div className="p-4 md:p-8">
//         <Label className="text-lg pb-2">Explore categories</Label>
//         <div
//           className="flex gap-3 overflow-x-auto relative"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           id="categories"
//         >
//           <Button
//             className="sticky -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block rounded-full"
//             variant="outline"
//             onClick={() => scrollByAmount("left")}
//           >
//             <ChevronLeft />
//           </Button>

//           {categories?.map((c) => (
//             <div
//               key={c.value}
//               className={cn(
//                 category === c.value && "ring-2 ring-primary",
//                 "relative flex-shrink-0 cursor-pointer hover:ring-2 rounded-xl m-1"
//               )}
//               onClick={() => {
//                 navigate({
//                   search: (p) => ({ ...p, category: c.value || "" }),
//                 });
//                 scrollToElementHorizontal(`#${c.value}`);
//               }}
//               id={c.value} // So scrollToElementHorizontal can target it
//             >
//               <img
//                 src={c?.icon || ""}
//                 alt=""
//                 className="size-36 md:size-52 object-contain"
//               />
//               <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl"></div>
//               <p className="absolute bottom-2 left-2 font-bold text-white text-lg">
//                 {c.label}
//               </p>
//             </div>
//           ))}

//           <Button
//             className="sticky right-4 top-1/2 -translate-y-1/2 hidden md:block rounded-full"
//             variant="outline"
//             onClick={() => scrollByAmount("right")}
//           >
//             <ChevronRight />
//           </Button>
//         </div>
//       </div>
//       <div className="lg:p-8 lg:space-y-8">
//         <div className="p-4 lg:p-0">
//           <div className=" lg:p-0 flex flex-col lg:flex-row items-center gap-2">
//             <SearchBar
//               placeholder="Search products"
//               defaultValue={q}
//               className="flex-1 w-full lg:w-auto p-0"
//             />
//           </div>
//         </div>
//         {isLoading ? null : !data || data.items.length === 0 ? (
//           <Card className="border-border">
//             <CardContent className="flex flex-1 justify-center flex-col items-center m-auto min-h-[60vh]  text-center">
//               <img
//                 src="/assets/no-results-found.png"
//                 alt="no-result-found"
//                 className="size-40 lg:size-48 object-cover"
//               />
//               <Label className="text-lg lg:text-xl pt-2">
//                 No products found {q ? `for "${q}"` : ""}
//               </Label>
//             </CardContent>
//           </Card>
//         ) : (
//           <>
//             <AddInventory items={data.items} opts={opts} />
//             <Pagination {...data} />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
