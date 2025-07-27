import { DashboardNav } from "@/components/nav.dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pos")({
  component: DashboardNav,
});
