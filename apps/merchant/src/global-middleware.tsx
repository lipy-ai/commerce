import { registerGlobalMiddleware } from "@tanstack/react-start";
import { logMiddleware } from "./utils/loggingMiddleware.tsx";

registerGlobalMiddleware({
  middleware: [logMiddleware],
});
