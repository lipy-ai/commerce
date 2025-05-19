import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import SearchBar from "../searchBar";
import { useRef, useState, useEffect } from "react";
import { LocateFixed, MapPinned } from "lucide-react";
import { Button } from "../ui/button";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import DetailedAddress from "./detailedAddress";



export default function GoogleMapImage() {
  const { isLoaded} = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAsNy254oD0STougpSJlkBg3nzUemntS9s",
    libraries: ["places", "geocoding"],
  });



  const [mapCenter, setMapCenter] = useState({
    lat: 26.121832,
    lng: 85.358553,
  });
  const [address, setAddress] = useState("");
  const [addressName, setAddressName] = useState("");
  const [zoom, setZoom] = useState(15);
  const autocompleteRef = useRef(null);
  const { isMobile } = useViewport();
  const [fullAddress, setFullAddress]= useState(
    {
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        }
  )


  
  const fillFullAddress = (addressComponents : google.maps.GeocoderAddressComponent[] , addCompLen: number, placeAddress: string)=>{

    setFullAddress((prev) => ({
            ...prev,
            address: placeAddress || "",
        })) 

        if(addCompLen >0){
            if(addressComponents[addCompLen-1]?.types?.includes("postal_code")){
                setFullAddress((prev) => ({
                    ...prev,
                    postal_code: addressComponents[addCompLen-1]?.long_name || "",
                }))
            }

            if(addressComponents[addCompLen-2]?.types?.includes("country")){
                setFullAddress((prev) => ({
                    ...prev,
                    country: addressComponents[addCompLen-2]?.long_name || "",
                }))
            }

            if(addressComponents[addCompLen-3]?.types?.includes("administrative_area_level_1")){
                setFullAddress((prev) => ({
                    ...prev,
                    state: addressComponents[addCompLen-3]?.long_name || "",
                }))
            }
            var i =addCompLen

            while(i >= 4){
                if(addressComponents[i-4]?.types?.includes("locality")){
                    setFullAddress((prev) => ({
                        ...prev,
                        city: addressComponents[i-4]?.long_name || "",
                    }))
                    break;
                }
                i--;
            }


        }

  }

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setMapCenter({ lat, lng });
        const placeAddress = place.formatted_address || place.name;
        setAddress(placeAddress);
        setAddressName(place.name)
        setZoom(18);

        const addCompLen = place.address_components?.length || 0;
        const addressComponents = place.address_components || [];

        fillFullAddress(addressComponents,addCompLen, placeAddress)
        
      }
    }
  };

  const getGeocodeFromLatLng = (lat : number, lng : number) => {
    if (!window.google || !window.google.maps) return;
    
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        setAddress(results[0].formatted_address);
        setAddressName(results[0].address_components?.[1]?.long_name || "");
        fillFullAddress(results[0].address_components, results[0].address_components?.length || 0, results[0].formatted_address)
      }
    });
  };

  // Fetch initial address when the map loads
  useEffect(() => {
    if (isLoaded && mapCenter.lat && mapCenter.lng) {
      getGeocodeFromLatLng(mapCenter.lat, mapCenter.lng);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-muted-foreground/20 animate-pulse rounded-lg my-4"></div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-2 lg:p-4">
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceSelect}
        >
          <SearchBar placeholder="Search for address" />
        </Autocomplete>
      </div>

      <div className="relative flex-grow">
        <GoogleMap
          zoom={zoom}
          center={mapCenter}
          mapContainerStyle={{ width: "100%", height: "calc(100vh - 220px)" }}
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
                getGeocodeFromLatLng(lat, lng);
              }
            }}
          />
        </GoogleMap>

        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            className="text-primary border-primary font-semibold shadow-md hover:bg-primary/10"
            variant="outline"
            onClick={() => {
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter({ lat: latitude, lng: longitude });
                getGeocodeFromLatLng(latitude, longitude);
              });
            }}
          >
            <LocateFixed className="text-primary mr-2" />
            Use current location
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t  bg-background w-full p-4 shadow-md",
          isMobile ? "fixed bottom-0 left-0 right-0 z-20" : "mt-auto"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={cn(
              "flex items-center gap-4",
              isMobile ? "flex-col" : "flex-row justify-between"
            )}
          >
            <div className="flex items-start gap-3 w-full lg:w-auto">
              <MapPinned className="size-8 text-primary mt-1 flex-shrink-0" />
              <div className="overflow-hidden">
                <h1 className="text-lg font-semibold truncate">{addressName || "Loading address..."}</h1>
                <p className="text-sm text-muted-foreground line-clamp-2">{address || "Please wait while we retrieve location details"}</p>
              </div>
            </div>
           
        
              <DetailedAddress fullAddress={fullAddress} label="Add"/>
           
          </div>
        </div>
      </div>
    </div>
  );
}