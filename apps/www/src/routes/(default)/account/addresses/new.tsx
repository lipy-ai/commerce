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

  const [autocomplpeteDrawer, setAutocomplpeteDrawer] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 26.121832,
    lng: 85.358553,
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
    } catch (error) {
    } finally {
      setFetchingAddress(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isLoaded && mapCenter) {
      handleMapCenterChange();
    }
  }, [isLoaded, mapCenter]);

  if (!isLoaded) return <Loading />;
  return (
    <div>
      <DashboardHeader
        title={type === "deliveryAddress" ? "Delivery Address" : "New Address"}
      />
      <div className="relative">
        <Button
          className="absolute top-4   text-muted-foreground  z-10 left-4 right-4 m-0 justify-start bg-card"
          variant={"outline"}
          onClick={() => setAutocomplpeteDrawer(true)}
        >
          <Search />
          Search your location
        </Button>

        <GoogleMap
          zoom={15}
          center={mapCenter}
          mapContainerStyle={{
            width: "100%",
            height: "calc(100vh - 220px)",
          }}
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
            draggable={true}
            onDragEnd={(e) => {
              const lat = e?.latLng?.lat();
              const lng = e?.latLng?.lng();
              if (lat && lng) {
                setMapCenter({ lat, lng });
              }
            }}
          />
        </GoogleMap>

        <div className="relative border-t  bg-background  p-4  z-20  lg:absolute bottom-0 right-0  w-full ">
          <div
            className={cn(
              "flex items-center gap-4 ",
              isMobile
                ? "flex-col w-full  justify-between"
                : "flex-row justify-between"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <MapPinned className="size-8 text-primary  flex-shrink-0" />
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

            {type === "saveAddress" && (
              <div className="lg:w-fit   fixed bottom-4 right-4 left-4">
                <Button
                  className="font-semibold w-full"
                  onClick={() => {
                    setIsConfirm(true);
                  }}
                >
                  Confirm this address
                  <StepForward className="ml-2 h-4 w-4 fill-card" />
                </Button>
              </div>
            )}
            {type === "deliveryAddress" && (
              <div className="lg:w-fit   fixed bottom-4 right-4 left-4">
                <Button
                  className="font-semibold w-full lg:w-fit"
                  onClick={() => {
                    setDeliveryLocation(fullAddress);

                    navigate({ to: "/" });
                  }}
                >
                  Confirm & Proceed
                </Button>
              </div>
            )}
          </div>

          <div className="absolute -top-12 lg:bottom-24 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              className="text-primary border-primary font-semibold shadow-md "
              variant="outline"
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  setMapCenter({ lat: latitude, lng: longitude });
                });
              }}
            >
              <LocateFixed className="text-primary mr-2" />
              Use current location
            </Button>
          </div>
        </div>
      </div>

      {autocomplpeteDrawer && (
        <AddressSetter
          open={autocomplpeteDrawer}
          onOpenChange={setAutocomplpeteDrawer}
          autocompleteOnly
          setMapCenter={setMapCenter}
        />
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
  );
}
