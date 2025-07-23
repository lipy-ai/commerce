import { OrderEdit } from "@/components/order.edit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pos/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderEdit />;
}
