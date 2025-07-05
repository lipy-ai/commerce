import type { auth } from "@/auth";
import type { hasPermission } from "@/auth/permission";
import { DBTypes } from "@/db";
import type { Context, Env } from "hono";
export * from "./auth";
import type { AvailableEvents } from "@/events";
import type { routes } from "../app";
export type AppType = typeof routes;
import type { Emitter } from "@hono/event-emitter";

export interface ServerContext extends Env {
	Variables: {
		emitter: Emitter<AvailableEvents>;
		user: typeof auth.$Infer.Session.user | null;
		session:
			| (typeof auth.$Infer.Session.session & { activeStoreId: string | null })
			| null;
		orgUser: Awaited<ReturnType<typeof hasPermission>> | null;
	};
}

export type SuccessResponse<T = void> = {
	success: true;
	message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
	success: false;
	error: { message: string; cause: any };
};

export type AwaitedReturn<T extends (...args: any) => any> = Awaited<
	ReturnType<T>
>;

export type HonoContext = Context;
