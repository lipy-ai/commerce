import type { DBTypes } from "@lipy/server/db";
import { Link } from "@tanstack/react-router";
import { Bike, Dot } from "lucide-react";

export default function StoreCard({
  data,
}: {
  data: Partial<DBTypes["store"]> & { distance?: { text: string } };
}) {
  return (
    <div className="p-0">
      <Link to="/$storeHandle" params={{ storeHandle: data.handle || "" }}>
        <div className="relative rounded-2xl overflow-hidden">
          <span className="block bg-gradient-to-b from-transparent via-transparent to-black/40 absolute top-0 left-0 size-full" />
          {data.image ? (
            <img
              src={data.image}
              alt={data.name}
              className="object-cover rounded-t-xl bg-accent/30 aspect-video"
            />
          ) : (
            <div className="rounded-t-xl bg-gradient-to-b from-[#1F58CB] to-[#073A9F] aspect-video flex items-center justify-center">
              <h1 className="text-white font-semibold text-lg truncate">
                {data.name}
              </h1>
            </div>
          )}
          <div className="absolute bottom-2 flex justify-end gap-2 w-full px-2">
            {(data?.freeDeliveryDistance && data.freeDeliveryDistance > 0 && (
              <div className="text-white rounded-md flex items-center gap-1 text-xs">
                <Bike className="size-3 stroke-2 text-blue-400" />
                <p>Free delivery within {data.freeDeliveryDistance} km</p>
              </div>
            )) ||
              ""}
          </div>
        </div>
        <div className="py-3">
          <div className="flex gap-2 justify-between items-start">
            <h3 className="text-xl font-bold break-words truncate">
              {data.name}
            </h3>
          </div>

          <div className="text-muted-foreground">
            <p className="inline">
              {data.address?.line2 || data.address?.city}
            </p>

            {data?.distance?.text && (
              <>
                <Dot className="fill-muted-foreground inline w-fit" />
                <p className="inline">{data?.distance?.text}</p>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
