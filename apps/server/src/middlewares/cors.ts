import env from "@/env";
import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: env.TRUSTED_ORIGINS, // replace with your origin
  allowHeaders: ["Content-Type", "Authorization", "M2M-Key"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});
