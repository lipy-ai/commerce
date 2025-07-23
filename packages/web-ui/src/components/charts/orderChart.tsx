import type { merchantDashboardApi } from "@lipy/lib/api";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@lipy/web-ui/components/ui/chart";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import type { InferResponseType } from "hono";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
export function OrderChart({
  data,
  isLoading,
}: {
  data:
    | InferResponseType<typeof merchantDashboardApi.index.$get>["counts"]
    | undefined;
  isLoading: boolean;
}) {
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const daysOfMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  const chartMap: Array<{ date: string; count: number }> = [];

  for (const day of daysOfMonth) {
    const date = format(day, "yyyy-MM-dd");
    const v = data?.find(
      (f) => format(new Date(f.date), "yyyy-MM-dd") === date
    );

    chartMap.push({
      date,
      count: v?.count || 0,
    });
  }

  const chartConfig = {
    views: {
      label: "Page Views",
    },
    count: {
      label: "Orders",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          This {format(new Date(), "LLLL yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartMap || []}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              minTickGap={10}
              tickFormatter={(v) => format(v, "dd MMM")}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="count"
              stackId="a"
              fill="var(--color-count)"
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
