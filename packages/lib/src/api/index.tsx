import { env } from "@envClient";
import type { AppType } from "@lipy/server/app";
import { hc } from "hono/client";

export const apiClient = hc<AppType>(env.API_URL!, {
  init: {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  },
});
