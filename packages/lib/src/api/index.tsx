import { hc } from "hono/client";
import type { AppType } from "@lipy/server/app";
import { env } from "@envClient";

export const apiClient = hc<AppType>(env.API_URL, {
  init: {
    credentials: "include",
  },
});
