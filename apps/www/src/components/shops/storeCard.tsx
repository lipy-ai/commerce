import type { publicShopApi } from "@lipy/lib/api";
import { Link } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import { Bike, Dot } from "lucide-react";

export default function StoreCard({
  data,
}: {
  data: InferResponseType<typeof publicShopApi.index.$get>[0];
}) {
  return (
    <div className="p-0">
      <Link to="/$storeHandle" params={{ storeHandle: data.handle || "" }}>
        <div className="relative rounded-2xl overflow-hidden">
          <span className="block bg-gradient-to-b from-transparent via-transparent to-black/40 absolute top-0 left-0 size-full" />
          <img
            src={data.image || "/assets/paper-bag-items.webp"}
            alt={data.name}
            className="object-cover rounded-t-xl bg-accent/30 aspect-video"
          />
          {data.freeDeliveryDistance > 0 && (
            <div className="absolute bottom-2 right-2 backdrop-blur-md bg-black/30 text-white  rounded-md flex items-center gap-1 text-xs px-1.5 py-0.5">
              <Bike className="size-3 stroke-2 text-blue-400" />
              <p>Free delivery within {data.freeDeliveryDistance} km</p>
            </div>
          )}
        </div>
        <div className="py-3">
          <div className="flex gap-2 justify-between items-start">
            <h3 className="text-xl font-bold line-clamp-2 break-words">
              {data.name}
            </h3>
            <p className="capitalize bg-tertiary/60  p-0.5 rounded-lg px-1">
              {data.type}
            </p>
          </div>

          <div className="flex items-center gap-0 text-muted-foreground">
            <p>{data.address?.line2 || data.address?.city}</p>

            <Dot className="fill-muted-foreground" />
            <p>{data.distance.text}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
