import { apiClient } from "@repo/lib/api/index.js";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@web-ui/components/ui/button";
import { toast } from "@web-ui/components/ui/sonner";

export const Route = createFileRoute("/demo/directMutation")({
  component: RouteComponent,
});

function RouteComponent() {
  const handle = () => {
    toast.promise(
      apiClient.v1.address.$post({
        json: {
          name: "string",
          country: "string",
          tag: "home",
          line1: "string",
          line2: "string",
          city: "string",
          state: "string",
          postalCode: "string",
        },
      }),
      {
        success: "Success",
        error: "Error",
        loading: "Saving",
      }
    );
  };
  return (
    <div className="p-8">
      <p>This will save address:</p>
      <div>
        <Button onClick={handle}>Save Mutation</Button>
      </div>
    </div>
  );
}
