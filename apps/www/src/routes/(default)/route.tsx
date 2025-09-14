import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
// import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
// import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute, Outlet } from "@tanstack/react-router";
// import { Loader2 } from "lucide-react";
import LocationComponent from "./account/addresses/-deliveryAddressAlert";

export const Route = createFileRoute("/(default)")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { isMobile } = useViewport();
  const { deliveryLocation, hasHydrated } = useLocationStore();

  return (
    <>
      {hasHydrated && deliveryLocation.line1 === "" && <LocationComponent />}
      {/* {hasHydrated && deliveryLocation.line1 === "" && isMobile && (
        <AddressFetchingSkeleton />
      )} */}
      <Outlet />
    </>
  );
}

// function AddressFetchingSkeleton() {
//   return (
//     <>
//       <div className="space-y-2.5 p-4">
//         <Skeleton className="h-6 w-32 " />
//         <Skeleton className="h-8" />
//       </div>

//       <div className="flex flex-col flex-1 items-center justify-center m-auto px-6 text-center space-y-2">
//         <Loader2 className="size-10 text-secondary animate-spin" />

//         <p className="font-medium text-lg text-muted-foreground">
//           Your favorite shops at your doorstep
//         </p>
//       </div>
//     </>
//   );
// }
