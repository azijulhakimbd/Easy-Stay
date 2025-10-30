"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 198 },
  { month: "August", desktop: 256 },
  { month: "September", desktop: 312 },
  { month: "October", desktop: 278 },
  { month: "November", desktop: 190 },
  { month: "December", desktop: 230 },
];

const chartConfig = {
  desktop: {
    label: "Total",
    color: "var(--chart-4)",
  },
} 

export function PingingDotChart({monthlyEarings}) {
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Annual Earing
          <Badge
            variant="outline"
            className="text-green-500 bg-green-500/10 border-none ml-2"
          >
            <TrendingUp className="h-4 w-4" />
          
          </Badge>
        </CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={monthlyEarings}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="totalUSD"
              type="linear"
              stroke="var(--color-desktop)"
              strokeDasharray="4 4"
              dot={<CustomizedDot />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomizedDot = (props) => {
  const { cx, cy, stroke } = props;

  return (
    <g>
      {/* Main dot */}
      <circle cx={cx} cy={cy} r={3} fill={stroke} />
      {/* Ping animation circles */}
      <circle
        cx={cx}
        cy={cy}
        r={3}
        stroke={stroke}
        fill="none"
        strokeWidth="1"
        opacity="0.8"
      >
        <animate
          attributeName="r"
          values="3;10"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;0"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
};