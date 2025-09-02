import NavBar from "@/components/navBar";
import NearbyShops from "@/components/shops/nearbyShops";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(default)/category/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return (
    <>
      <NavBar />
      <div className="p-8 max-w-7xl mx-auto w-full">
        <NearbyShops category={slug} />
      </div>
    </>
  );
}
