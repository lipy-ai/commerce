import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/store/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DashboardHeader title="Stores">
        <Link
          className={cn(buttonVariants())}
          to="/admin/store/form"
          search={{ view: "create", store: undefined }}
        >
          {" "}
          <Plus /> Create new store
        </Link>
      </DashboardHeader>
    </div>
  );
}
