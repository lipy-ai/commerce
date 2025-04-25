import { hc } from "hono/client";
import type { AppType } from "@lipy/server/app";

export const apiClient = hc<AppType>("http://localhost:8080");
