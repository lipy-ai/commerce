import { useEffect, useState } from "react";
import { IS_REACT_NATIVE, useReactNativeBridge } from "./use-reactNative";

export function useCurrentLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const { callReactNative } = useReactNativeBridge();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentPosition = async () => {
    setIsLoading(true);
    let result = undefined;

    if (IS_REACT_NATIVE) {
      const nativeLoc = await callReactNative({ action: "getLocation" });
      result = nativeLoc?.coords || null;
    } else {
      result = navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          return { latitude, longitude };
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true, // more accurate but uses more battery
          timeout: 10000, // max time to wait
          maximumAge: 0, // no cached positions
        }
      );
    }
    if (!result) {
      setError("Error getting location!");
    }
    setIsLoading(false);
    return setLocation(result);
  };

  // useEffect(() => {
  //   if (!navigator.geolocation) {
  //     setError("Geolocation is not supported by your browser.");
  //     return setIsLoading(false);
  //   }

  //   const watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       setLocation({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         accuracy: position.coords.accuracy,
  //       });
  //       setError(null);
  //       setIsLoading(false);
  //     },
  //     (err) => {
  //       setError(err.message);
  //       setIsLoading(false);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 0,
  //       ...options,
  //     }
  //   );

  //   return () => {
  //     navigator.geolocation.clearWatch(watchId);
  //   };
  // }, []);

  useEffect(() => {
    getCurrentPosition();
  }, []);

  return { location, error, isLoading, getCurrentPosition };
}
