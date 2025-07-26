import { OrderEdit } from "@/components/order.edit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pos/checkout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderEdit />;
}
