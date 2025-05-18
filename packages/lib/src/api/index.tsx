import { hc } from "hono/client";
import type { AppType } from "@lipy/server/app";
import { env } from "@envClient";

export const apiClient = hc<AppType>(env.API_URL!, {
  init: {
    credentials: "include",
    headers: { "M2M-Key": env.M2M_KEY! }, //{ ...(process.env.M2M_key && { "M2M-Key": process.env.M2M_key }) },
  },
});
