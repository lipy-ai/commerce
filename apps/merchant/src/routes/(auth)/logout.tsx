import {
  IS_REACT_NATIVE,
  REACT_NATIVE_APP_SCHEME,
  useReactNativeBridge,
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
  const { callReactNative } = useReactNativeBridge();
  useEffect(() => {
    if (IS_REACT_NATIVE) {
      navigate({ href: `${REACT_NATIVE_APP_SCHEME}logout` });
      callReactNative({ action: "signOut" });
    } else {
      authClient.signOut().then((_e) => navigate({ to: "/", replace: true }));
    }
  });
  return <Loading title="Logging out..." />;
}
