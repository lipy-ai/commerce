// bridge.ts (on website side)
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    IS_REACT_NATIVE?: boolean;
    REACT_NATIVE_APP_SCHEME?: string;
  }
}

type PendingMap = Record<string, (val: any) => void>;

export const IS_REACT_NATIVE: boolean =
  (typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("is_app") || "false")) ||
  false;

export const REACT_NATIVE_APP_SCHEME: string | undefined =
  (typeof window !== "undefined" &&
    (localStorage.getItem("app_scheme") || undefined)) ||
  undefined;

if (IS_REACT_NATIVE && !REACT_NATIVE_APP_SCHEME) {
  window.alert("Scheme not defined!");
}

export const sendMessageToReactNative = (
  payload: any,
  opts?: { id?: string }
) => {
  console.info("Sending message --->", payload);
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({ ...opts, type: "request", payload })
  );
};

export function useReactNativeBridge() {
  const pending = useRef<PendingMap>({});

  // listen for responses from RN
  useEffect(() => {
    function handler(event: MessageEvent) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "response" && pending.current[data.id]) {
          pending.current[data.id](data.payload);
          delete pending.current[data.id];
        }
      } catch {}
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // send message & return a promise
  function callReactNative(payload: any): Promise<any> {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).slice(2);
      pending.current[id] = resolve;
      sendMessageToReactNative(payload, { id });
    });
  }

  return { callReactNative };
}
