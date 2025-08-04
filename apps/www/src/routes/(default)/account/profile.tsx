import UserProfile from "@lipy/web-ui/components/pages/profile";
import { createFileRoute } from "@tanstack/react-router";
import { AccountNav } from "./-nav";

export const Route = createFileRoute("/(default)/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AccountNav>
      <UserProfile />
    </AccountNav>
  );
}
