import { env } from "@envClient";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
// app/provider.tsx
import { useEffect, useState } from "react";

export function PHProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    posthog.init(env.POSTHOG_PUBLIC_KEY!, {
      api_host: env.POSTHOG_HOST,
      defaults: "2025-05-24",
      person_profiles: "always",
    });

    setHydrated(true);
  }, []);

  if (!hydrated || !env.IN_PROD) return <>{children}</>;
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
