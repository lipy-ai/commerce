import {
  IS_REACT_NATIVE,
  sendMessageToReactNative,
} from "@lipy/lib/hooks/use-reactNative";
import { authClient } from "@lipy/lib/providers/auth";
import Loading from "@lipy/web-ui/components/ui/loading";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)/logout")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  useEffect(() => {
    console.info("Signing out -", IS_REACT_NATIVE ? "native" : "web");

    if (IS_REACT_NATIVE) {
      sendMessageToReactNative({ action: "signOut" });
    } else {
      authClient.signOut().then((_e) => navigate({ to: "/", replace: true }));
    }
  });
  return <Loading title="Logging out..." />;
}
