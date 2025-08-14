import { env } from "@envClient";
import { nearbySearch } from "@lipy/web-ui/components/maps/utils/helper";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lipy/web-ui/components/ui/table";
import { cn } from "@lipy/web-ui/lib/utils";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/leads/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY,
    libraries: env.GOOGLE_MAP_LIBRARIES,
  });

  const [shops, setShops] = useState<any[]>([]);

  const [mapCenter, setMapCenter] = useState({
    lat: 28.6139,
    lng: 77.209,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const handle = async () => {
    await nearbySearch(mapCenter, 500, ["restaurant", "cafe"])
      .then((results) => {
        console.log("Nearby restaurants:", results);
        setShops(results);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!isLoaded) return <Loading />;

  return (
    <div className="p-8 space-y-4">
      <GoogleMap
        zoom={15}
        center={mapCenter}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          cameraControl: false,
        }}
        mapContainerClassName="h-[600px]"
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
      <Button onClick={handle}>Generate Leads</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Ratings</TableHead>
            <TableHead>Highlights</TableHead>

            <TableHead className="w-48">Address</TableHead>
            <TableHead>Direction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.map((shop, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-base">
                {shop.displayName}
              </TableCell>
              <TableCell>
                {shop.nationalPhoneNumber ||
                  shop.internationalPhoneNumber ||
                  "-"}
              </TableCell>
              <TableCell className="w-56 whitespace-normal">
                {shop.websiteURI}
              </TableCell>
              <TableCell>
                <p className="text-base font-medium">{shop.rating}</p>
                <p>Count - {shop.userRatingCount}</p>
              </TableCell>
              <TableCell>
                <p>{shop.hasDelivery && "Delivery"}</p>
                <p>{shop.hasTakeout && "Takeout"}</p>
                <p>{shop.hasDineIn && "Dine In"}</p>
              </TableCell>

              <TableCell className="w-48 whitespace-normal">
                {shop?.formattedAddress || "-"}
              </TableCell>
              <TableCell>
                <a
                  href={shop.googleMapsURI}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "flex items-center gap-2"
                  )}
                >
                  <MapPin className="size-4" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
