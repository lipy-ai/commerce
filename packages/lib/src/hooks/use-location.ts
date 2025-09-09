import { useEffect, useState } from "react";

const getCurrentPosition = () => {
  return navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      return { latitude, longitude };
    },
    (error) => {
      console.error("Error getting location:", error.message);
    },
    {
      enableHighAccuracy: true, // more accurate but uses more battery
      timeout: 5000, // max time to wait
      maximumAge: 0, // no cached positions
    }
  );
};

export function useCurrentLocation(options = {}) {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return setIsLoading(false);
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error, isLoading, getCurrentPosition };
}
