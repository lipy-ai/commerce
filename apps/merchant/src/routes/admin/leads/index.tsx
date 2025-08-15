import { env } from "@envClient";
import { adminTestApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import { nearbySearch } from "@lipy/web-ui/components/maps/utils/helper";
import { Badge } from "@lipy/web-ui/components/ui/badge";
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
import { Download, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useLeadStore } from "./-store";

export const Route = createFileRoute("/admin/leads/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY,
    libraries: env.GOOGLE_MAP_LIBRARIES,
  });

  const { mapCenter, setMapCenter, result, setResult } = useLeadStore();

  const mutate = useAPIMutation(adminTestApi.lead, "$post", {
    onSuccess: () => {
      toast.success("Lead added ");
    },
  });

  const handle = async () => {
    await nearbySearch(mapCenter, 500, ["restaurant", "cafe"])
      .then((results) => {
        console.log("Nearby restaurants:", results);
        setResult(results as google.maps.places.Place[]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const downloadLead = async (result: google.maps.places.Place) => {
    await mutate.mutateAsync({
      json: {
        name: result.displayName || "",
        type: result.primaryTypeDisplayName || "",
        address: result.formattedAddress || "",
        phone:
          result.nationalPhoneNumber || result.internationalPhoneNumber || "-",
        website: result.websiteURI,
        rating: result.rating || 0,
        ratingCount: result.userRatingCount || 0,
        highlights: `${result.hasDelivery ? "Delivery" : ""}  | ${result.hasDineIn ? "Dine In" : ""} |  ${result.hasTakeout ? "Take Out" : ""}`,
        gmapurl: result.googleMapsURI,
      } as any,
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

            <TableHead className="w-64">Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.map((shop, index) => (
            <TableRow key={index}>
              <TableCell className=" w-40">
                <p className="font-medium text-base">{shop.displayName}</p>
                <Badge variant={"warning"}>{shop.primaryTypeDisplayName}</Badge>
              </TableCell>
              <TableCell>
                {shop.nationalPhoneNumber ||
                  shop.internationalPhoneNumber ||
                  "-"}
              </TableCell>
              <TableCell className="w-48 whitespace-normal">
                <a
                  href={shop.websiteURI || ""}
                  target="_blank"
                  className="text-blue-500"
                >
                  {shop.websiteURI}
                </a>
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

              <TableCell className="w-64 whitespace-normal">
                {shop?.formattedAddress || "-"}
              </TableCell>
              <TableCell className="flex gap-2 items-center justify-end">
                <a
                  href={shop.googleMapsURI || ""}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "flex items-center gap-2"
                  )}
                  target="_blank"
                >
                  <MapPin className="size-4" />
                </a>

                <Button size="icon" onClick={() => downloadLead(shop)}>
                  <Download />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
