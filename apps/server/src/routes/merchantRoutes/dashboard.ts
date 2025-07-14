import { db } from "@/db";
import type { ServerContext } from "@/types";
import { format, subDays } from "date-fns";
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
				"ordered",
				"accepted",
				"packed",
				"out_for_delivery",
			])
			.orderBy(
				sql`
                CASE o.status
                    WHEN 'ordered' THEN 1
                    WHEN 'accepted' THEN 2
                    WHEN 'packed' THEN 3
                    WHEN 'out_for_delivery' THEN 4
                    ELSE 5
                END`,
			)
			.selectAll()
			.execute();

		const countsQuery = db
			.selectFrom("orders")
			.select([
				sql`DATE("orderedAt")`.as("date"),
				"status",
				sql`COUNT(*)::int`.as("count"),
			])
			.where("storeId", "=", sess?.activeStoreId!)
			.where("orderedAt", ">=", startDate)
			.groupBy([sql`DATE("orderedAt")`, "status"])
			.orderBy(sql`DATE("orderedAt")`)
			.execute();

		const [pendingOrders, counts] = await Promise.all([
			pendingOrdersQuery,
			countsQuery,
		]);

		const chartMap: Record<
			string,
			{ date: string; pending: number; completed: number; returned: number }
		> = {};

		for (let i = 0; i < 30; i++) {
			const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
			chartMap[date] = {
				date,
				pending: 0,
				completed: 0,
				returned: 0,
			};
		}

		for (const row of counts) {
			const date = format(new Date(row.date as string), "yyyy-MM-dd");
			const count = Number(row.count);
			switch (row.status) {
				case "ordered":
				case "accepted":
				case "packed":
				case "out_for_delivery":
					chartMap[date]?.pending && (chartMap[date].pending += count);
					break;
				case "delivered":
					chartMap[date]?.completed && (chartMap[date].completed += count);
					break;
				case "refunded":
				case "replaced":
				case "return_requested":
					chartMap[date]?.returned && (chartMap[date].returned += count);
					break;
			}
		}

		return c.json({ pendingOrders, counts: Object.values(chartMap) });
	},
);
