import { db } from "@/db";
import type { ServerContext } from "@/types";
import {
	eachDayOfInterval,
	endOfMonth,
	format,
	startOfMonth,
	subDays,
	subMonths,
} from "date-fns";
import { Hono } from "hono";
import { sql } from "kysely";

export const merchantDashboardRoute = new Hono<ServerContext>().get(
	async (c) => {
		const sess = c.get("session");
		const startDate = subDays(new Date(), 29); // includes today

		const pendingOrdersQuery = db
			.selectFrom("orders as o")
			.where("o.storeId", "=", sess?.activeStoreId!)
			.where("status", "in", [
				"created",
				"accepted",
				"packed",
				"out_for_delivery",
			])
			.orderBy(
				sql`
                CASE o.status
                    WHEN 'created' THEN 1
					WHEN 'awaiting_customer_confirmation' THEN 1
					WHEN 'return_requested' THEN 1
                    WHEN 'accepted' THEN 2
                    WHEN 'packed' THEN 3
                    WHEN 'out_for_delivery' THEN 4
                    ELSE 5
                END`,
			)
			.orderBy("orderedAt", "desc")
			.selectAll()
			.execute();

		const lastMonthStart = startOfMonth(new Date());
		const lastMonthEnd = endOfMonth(new Date());

		const countsQuery = await db
			.selectFrom("orders")
			.select([
				sql`DATE("orderedAt")`.as("date"),
				sql`COUNT(*)::int`.as("count"),
			])
			.where("storeId", "=", sess?.activeStoreId!)
			.where("orderedAt", ">=", lastMonthStart)
			.where("orderedAt", "<=", lastMonthEnd)
			.groupBy([sql`DATE("orderedAt")`])
			.execute();

		const [pendingOrders, counts] = await Promise.all([
			pendingOrdersQuery,
			countsQuery,
		]);

		const daysOfLastMonth = eachDayOfInterval({
			start: lastMonthStart,
			end: lastMonthEnd,
		});

		const chartMap: Record<
			string,
			{ date: string; pending: number; completed: number; returned: number }
		> = {};

		for (const day of daysOfLastMonth) {
			const date = format(day, "yyyy-MM-dd");
			chartMap[date] = {
				date,
				pending: 0,
				completed: 0,
				returned: 0,
			};
		}

		return c.json({ pendingOrders, counts });
	},
);
