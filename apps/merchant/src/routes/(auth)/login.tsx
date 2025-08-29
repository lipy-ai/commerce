import {
  IS_REACT_NATIVE,
  REACT_NATIVE_APP_SCHEME,
  useReactNativeBridge,
} from "@lipy/lib/hooks/use-reactNative";
import { LoginScreen } from "@lipy/web-ui/screens/auth/login";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { callReactNative } = useReactNativeBridge();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    navigate({ href: `${REACT_NATIVE_APP_SCHEME}logout` });
    callReactNative({ action: "signOut" });
  }, []);

  if (IS_REACT_NATIVE) return null;
  return <LoginScreen />;
}
