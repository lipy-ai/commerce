import { env } from "@envClient";
import { loggedInAddressApi } from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
  fillBaseAddress,
  reverseGeocode,
} from "@lipy/web-ui/components/maps/utils/helper";
import {
  type AddressType,
  defaultDeliveryLocationState,
  useLocationStore,
} from "@lipy/web-ui/components/maps/utils/store";
import { Button } from "@lipy/web-ui/components/ui/button";
import { useJsApiLoader } from "@react-google-maps/api";
import { MapPinOff, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AddressSetter } from "../../../../components/address/addressSetter";
import { useCurrentLocation } from "@lipy/lib/hooks/use-location";

function LocationComponent() {
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { setDeliveryLocation } = useLocationStore();
  const { location } = useCurrentLocation();
  const { isLoaded: mapLoaded } = useJsApiLoader({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY,
    libraries: env.GOOGLE_MAP_LIBRARIES,
  });

  const { data: primaryAddress, isLoading } = useAPIQuery(
    loggedInAddressApi.primary,
    "$get",
    {},
    { enabled: !!session }
  );

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      handleError("Location permission not enabled.");
      return;
    }

    // if (window?.ReactNativeWebView) {
    //   handleError("Reactnative");
    // }

    // navigator.geolocation.getCurrentPosition(
    //   async ({ coords }) => {

    //   },
    //   () => handleError("Location permission is off.")
    // );

    const lat = location?.latitude;
    const lng = location?.longitude;

    if (!lat || !lng || !mapLoaded) {
      handleError("Unable to retrieve coordinates.");
      return;
    }

    try {
      const { result } = await reverseGeocode(lat, lng);
      const newLocation: AddressType = {
        ...defaultDeliveryLocationState.deliveryLocation,
        ...fillBaseAddress(result),
      };
      setDeliveryLocation(newLocation);
    } catch {
      handleError("Unable to fetch location details.");
    }
  };

  const handleError = (message: string) => {
    setError(message);
    setDrawerOpen(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (!isLoading && mapLoaded) {
      if (primaryAddress?.id) {
        setDeliveryLocation(primaryAddress as AddressType);
      } else {
        handleGeolocation();
      }
    }
  }, [isLoading, mapLoaded, primaryAddress?.id]);

  if (error && !isLoading) {
    return (
      <DrawerDialogSwitcher open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerDialogHeader className="mx-auto">
          <div className="mx-auto rounded-xl p-4 border my-6">
            <MapPinOff className="size-16" />
          </div>

          <DrawerDialogTitle className="mx-auto text-xl text-center font-semibold">
            {error}
          </DrawerDialogTitle>

          <DrawerDialogDescription className="mx-auto text-base text-center">
            Please allow location permission for a better experience.
          </DrawerDialogDescription>
        </DrawerDialogHeader>

        <DrawerDialogFooter>
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <AddressSetter>
            <Button variant={"outline"}>
              <Search className="stroke-2" />
              Search your location
            </Button>
          </AddressSetter>
        </DrawerDialogFooter>
      </DrawerDialogSwitcher>
    );
  }

  return null;
}

export default LocationComponent;
