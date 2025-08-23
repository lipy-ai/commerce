// bridge.ts (on website side)
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    isReactNativeWebView?: boolean;
  }
}

type PendingMap = Record<string, (val: any) => void>;

export const IS_REACT_NATIVE =
  typeof window !== "undefined" && window.isReactNativeWebView === true;

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
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ id, type: "request", payload })
      );
    });
  }

  return { callReactNative };
}
