import { env } from "@envClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import {
  fillBaseAddress,
  reverseGeocode,
} from "@lipy/web-ui/components/maps/utils/helper";
import {
  type AddressType,
  defaultAddress,
  useLocationStore,
} from "@lipy/web-ui/components/maps/utils/store";
import { Button } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LocateFixed, MapPinned, Search, StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import { AccountNav } from "../-nav";
import { AddressSetter } from "./-addressSetter";

export const Route = createFileRoute("/(default)/account/addresses/new")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: search.type as "deliveryAddress" | "saveAddress" | undefined,
    };
  },
});

function RouteComponent() {
  const { type } = Route.useSearch();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY,
    libraries: env.GOOGLE_MAP_LIBRARIES,
  });

  const [mapCenter, setMapCenter] = useState({
    lat: 28.6901242,
    lng: 77.1700795,
  });

  const [isConfirm, setIsConfirm] = useState(false);

  const { setDeliveryLocation } = useLocationStore();
  const navigate = useNavigate();
  const { isMobile } = useViewport();
  const [fullAddress, setFullAddress] = useState<AddressType>(
    defaultAddress as AddressType
  );

  const [addressName, setAddressName] = useState("");
  const [fetchingAddress, setFetchingAddress] = useState(false);

  const handleMapCenterChange = async () => {
    try {
      setFetchingAddress(true);
      const { result } = await reverseGeocode(mapCenter.lat, mapCenter.lng);

      setAddressName(result.address_components?.[1]?.long_name || "");
      const newLocation: AddressType = {
        ...fullAddress,
        ...fillBaseAddress(result),
      };
      setFullAddress(newLocation);
    } catch (_error) {
    } finally {
      setFetchingAddress(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (isLoaded && mapCenter) {
      handleMapCenterChange();
    }
  }, [isLoaded, mapCenter]);

  if (!isLoaded) return <Loading />;
  return (
    <AccountNav>
      <div className="flex flex-col min-h-screen">
        <DashboardHeader
          title={
            type === "deliveryAddress" ? "Delivery Address" : "New Address"
          }
        />

        {/* Search Bar */}
        <div className="p-2 lg:p-4">
          <AddressSetter autocompleteOnly setMapCenter={setMapCenter}>
            <Button
              className="w-full justify-start text-muted-foreground bg-tertiary/50 border"
              variant="tertiary"
            >
              <Search />
              Search your location
            </Button>
          </AddressSetter>
        </div>

        {/* Map and Use Current Location Button */}
        <div className="relative flex-1">
          <GoogleMap
            zoom={15}
            center={mapCenter}
            mapContainerClassName="absolute inset-0"
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              cameraControl: false,
            }}
          >
            <Marker
              position={mapCenter}
              draggable
              onDragEnd={(e) => {
                const lat = e?.latLng?.lat();
                const lng = e?.latLng?.lng();
                if (lat && lng) setMapCenter({ lat, lng });
              }}
            />
          </GoogleMap>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              className="text-primary border-primary font-semibold shadow-md hover:bg-primary/10"
              variant="outline"
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  setMapCenter({ lat: latitude, lng: longitude });
                });
              }}
            >
              <LocateFixed className="text-primary mr-1 stroke-2" />
              Use current location
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 bg-background border-t p-4 shadow-md">
          <div
            className={cn(
              "flex items-center gap-4",
              isMobile
                ? "flex-col w-full justify-start"
                : "flex-row justify-between"
            )}
          >
            {/* Address Display */}
            <div className="flex items-center gap-3 w-full">
              <MapPinned className="size-8 text-primary flex-shrink-0" />
              <div className="overflow-hidden">
                <h1 className="text-lg font-semibold truncate">
                  {fetchingAddress
                    ? "Fetching address..."
                    : addressName || "Fetching address..."}
                </h1>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {fetchingAddress
                    ? "Please wait while we retrieve location details"
                    : fullAddress.line1 ||
                      "Please wait while we retrieve location details"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {type === "saveAddress" && (
              <div className="w-full lg:w-auto">
                <Button
                  className="font-semibold px-6 w-full"
                  onClick={() => setIsConfirm(true)}
                >
                  Confirm this address
                  <StepForward className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {type === "deliveryAddress" && (
              <Button
                className="font-semibold w-full lg:w-auto"
                onClick={() => {
                  setDeliveryLocation(fullAddress);
                  navigate({ to: "/" });
                }}
              >
                Confirm & Proceed
              </Button>
            )}

            {isConfirm && (
              <DetailedAddress
                fullAddress={fullAddress}
                label="Add"
                open={isConfirm}
                onOpenChange={setIsConfirm}
              />
            )}
          </div>
        </div>
      </div>
    </AccountNav>
  );
}
