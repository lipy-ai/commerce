import { env } from "@envClient";
import { useNavigate } from "@tanstack/react-router";
import { IS_REACT_NATIVE, sendMessageToReactNative } from "./use-reactNative";

export const redirectToLoginURL = () => {
  if (IS_REACT_NATIVE) return sendMessageToReactNative({ action: "login" });
  const url = `${!IS_REACT_NATIVE ? `${env.WEB_URL}/` : ""}login?cb=${btoa(window.location.href)}`;
  window.location.href = url;
};

// export const redirectToSessionRefreshURL = () => {
//   // Handler Reactnative
//   if (IS_REACT_NATIVE)
//     return sendMessageToReactNative({ action: "refreshSession" });
//   window.location.href = `${!IS_REACT_NATIVE ? `${env.WEB_URL}/` : ""}refresh?cb=${btoa(window.location.href)}`;
// };

export const useRedirect = () => {
  const navigate = useNavigate() as any;
  const handleNavigate = async (code?: string) => {
    if (!code) return;
    if (code === "NOT_LOGGED_IN") {
      redirectToLoginURL();
    }

    if (code === "NO_ACTIVE_STORE") {
      navigate({ to: "/register" });
    }

    if (code === "INSUFFICIENT_PERMISSION") {
      navigate({ to: "/error" });
    }
  };

  return { handleNavigate };
};
