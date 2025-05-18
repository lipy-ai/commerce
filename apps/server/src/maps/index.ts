import env from "@/env";
import { useJsApiLoader } from "@react-google-maps/api";
export const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: env.GOOGLE_MAPS_API_KEY,
  libraries: ["places"],
});
