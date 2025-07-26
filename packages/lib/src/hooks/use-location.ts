import { useEffect, useState } from "react";

export function useCurrentLocation(options = {}) {
	const [location, setLocation] = useState<{
		latitude: number;
		longitude: number;
		accuracy: number;
	} | null>(null);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser.");
			return;
		}

		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				setLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
				});
				setError(null);
			},
			(err) => {
				setError(err.message);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
				...options,
			},
		);

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, []);

	return { location, error };
}
