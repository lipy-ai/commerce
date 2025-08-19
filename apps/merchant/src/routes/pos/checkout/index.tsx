import { createFileRoute } from "@tanstack/react-router";
import { OrderEdit } from "@/components/order.edit";

export const Route = createFileRoute("/pos/checkout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderEdit />;
}
