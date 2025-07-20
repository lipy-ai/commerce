import type { merchantDashboardApi } from "@lipy/lib/api";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@lipy/web-ui/components/ui/chart";
import { format } from "date-fns";
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
  const chartConfig = {
    views: {
      label: "Page Views",
    },
    pending: {
      label: "Pending",
      color: "var(--chart-1)",
    },
    completed: {
      label: "Completed",
      color: "var(--chart-2)",
    },
    returned: {
      label: "Returned",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart accessibilityLayer data={data || []}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              minTickGap={10}
              tickFormatter={(v) => format(v, "dd MMM")}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="var(--color-pending)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="var(--color-completed)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="returned"
              stackId="a"
              fill="var(--color-returned)"
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
