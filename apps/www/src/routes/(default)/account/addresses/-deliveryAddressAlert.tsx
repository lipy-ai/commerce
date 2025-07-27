import { useJsApiLoader } from "@react-google-maps/api";
import { MapPinOff, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { env } from "@envClient";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";

import {
  fillBaseAddress,
  reverseGeocode,
} from "@lipy/web-ui/components/maps/utils/helper";
import {
  type AddressType,
  defaultDeliveryLocationState,
  useLocationStore,
} from "@lipy/web-ui/components/maps/utils/store";

import {
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { AddressSetter } from "./-addressSetter";

import { loggedInAddressApi } from "@lipy/lib/api";
import { Button } from "@lipy/web-ui/components/ui/button";

function LocationComponent() {
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setDeliveryLocation } = useLocationStore();
  const [deliveryAddressSetter, setDeliveryAddressSetter] = useState(false);

  const { isLoaded: mapLoaded } = useJsApiLoader({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY,
    libraries: env.GOOGLE_MAP_LIBRARIES,
  });

  const { data: primaryAddress, isLoading } = useAPIQuery(
    loggedInAddressApi.primary,
    "$get",
    {}
  );

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      handleError("Location permission not enabled.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
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
      },
      () => handleError("Location permission is off.")
    );
  };

  const handleError = (message: string) => {
    setError(message);
    setDrawerOpen(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (primaryAddress?.id && !isLoading) {
      setDeliveryLocation(primaryAddress as AddressType);
    } else if (mapLoaded) {
      handleGeolocation();
    }
  }, [isLoading, mapLoaded]);

  if (error && !isLoading) {
    return (
      <>
        <DrawerDialogSwitcher
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          dismissible={false}
          className="[&>button]:hidden"
        >
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
            <Button
              variant={"outline"}
              onClick={() => {
                setDrawerOpen(false);
                setDeliveryAddressSetter(true);
              }}
            >
              <Search className="stroke-2" />
              Search your location
            </Button>
          </DrawerDialogFooter>
        </DrawerDialogSwitcher>

        {deliveryAddressSetter && (
          <AddressSetter
            open={deliveryAddressSetter}
            onOpenChange={setDeliveryAddressSetter}
          />
        )}
      </>
    );
  }

  return null;
}

export default LocationComponent;
