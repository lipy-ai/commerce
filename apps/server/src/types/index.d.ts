import type { auth } from "@/auth";
import type { hasPermission } from "@/auth/permission";
import type { Context, Env } from "hono";
import type { routes } from "@/app";
export * from "./auth";

export type AppType = typeof routes;

export interface ServerContext extends Env {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    orgUser: Awaited<ReturnType<typeof hasPermission>> | null;
  };
}

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? {} : { data: T });
ß;

export type ErrorResponse = {
  success: false;
  error: { message: string; cause: any };
  isFormError?: boolean;
};

export type AwaitedReturn<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;

export type HonoContext = Context;
