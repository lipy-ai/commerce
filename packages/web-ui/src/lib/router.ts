import { useRouter } from "@tanstack/react-router";

export const goBack = () => {
  const router = useRouter();
  if (window.history.length > 1) {
    router.history.back();
  } else {
    router.navigate({ to: "/" }); // fallback to home
  }
};
