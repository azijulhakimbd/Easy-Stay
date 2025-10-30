"use client";

import { CartesianGrid, Line, LineChart, XAxis, Customized } from "recharts";
import { useCallback, useState } from "react";
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
  { month: "January", completed: 345, approved: 210 ,Pending: 120, rejected: 450 ,cancelled: 150 },
  { month: "February", completed: 524, approved: 380 ,Pending: 230, rejected: 230 ,cancelled: 50 },
  { month: "March", completed: 417, approved: 310 ,Pending: 250, rejected: 170 ,cancelled: 5},
  { month: "April", completed: 321, approved: 480 ,Pending: 280, rejected: 180 ,cancelled: 45},
  { month: "May", completed: 412, approved: 530 ,Pending: 300, rejected: 250,cancelled: 200},
  { month: "June", completed: 598, approved: 450 ,Pending: 370, rejected: 450 ,cancelled: 450},
  { month: "July", completed: 412, approved: 290 ,Pending: 450, rejected: 550 ,cancelled: 120},
  { month: "August", completed: 643, approved: 460 ,Pending: 500, rejected: 450 ,cancelled: 350},
  { month: "September", completed: 489, approved: 390 ,Pending: 598, rejected: 300,cancelled: 50 },
  { month: "October", completed: 576, approved: 470 ,Pending: 600, rejected: 250 ,cancelled: 5},
  { month: "November", completed: 787, approved: 620 ,Pending: 630, rejected: 370 ,cancelled: 10},
  { month: "December", completed: 298, approved: 250 ,Pending: 400, rejected: 450 ,cancelled: 2},
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--secondary-foreground)",
  },
  approved: {
    label: "Approved",
    color: "var(--chart-2)",
  },
  Pending:{
    label:"Pending",
    color:"var(--chart-3)",

  },
   rejected:{
    label:"Rejected",
    color:"var(--chart-4)",
    
  },
   cancelled:{
    label:"Cancelled",
    color:"var(--chart-4)",
    
  }
} 

export function MonthlyStatusLineChart({monthlyStatusData}) {
  const [DasharrayCalculator, lineDasharrays] = useDynamicDasharray({
    splitIndex: chartData.length - 2,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Partial Line Chart
          <Badge
            variant="outline"
            className="text-green-500 bg-green-500/10 border-none ml-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-54 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
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
            {Object.entries(chartConfig).map(([key, value]) => (
              <Line
                key={key}
                dataKey={key}
                type="linear"
                stroke={value.color}
                dot={{
                  r: 2.5,
                  fill: value.color,
                }}
                strokeDasharray={
                  lineDasharrays.find((line) => line.name === key)
                    ?.strokeDasharray || "0 0"
                }
              />
            ))}
            <Customized component={DasharrayCalculator} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function useDynamicDasharray({
  lineConfigs = [],
  splitIndex = -2,
  defaultDashPattern: dashPattern = [5, 3],
  curveAdjustment = 1,
}){
  const [lineDasharrays, setLineDasharrays] = useState([]);

  const DasharrayCalculator = useCallback(
    (props)=> {
      const chartLines = props?.formattedGraphicalItems;
      const newLineDasharrays = [];

      const calculatePathLength = (points) => {
        return (
          points?.reduce((acc, point, index) => {
            if (index === 0) return acc;

            const prevPoint = points[index - 1];

            const dx = (point.x || 0) - (prevPoint.x || 0);
            const dy = (point.y || 0) - (prevPoint.y || 0);

            acc += Math.sqrt(dx * dx + dy * dy);
            return acc;
          }, 0) || 0
        );
      };

      chartLines?.forEach((line) => {
        const points = line?.props?.points;
        const totalLength = calculatePathLength(points || []);

        const lineName = line?.item?.props?.dataKey;
        const lineConfig = lineConfigs?.find(
          (config) => config?.name === lineName
        );
        const lineSplitIndex = lineConfig?.splitIndex ?? splitIndex;
        const dashedSegment = points?.slice(lineSplitIndex);
        const dashedLength = calculatePathLength(dashedSegment || []);

        if (!totalLength || !dashedLength) return;

        const solidLength = totalLength - dashedLength;
        const curveCorrectionFactor =
          lineConfig?.curveAdjustment ?? curveAdjustment;
        const adjustment = (solidLength * curveCorrectionFactor) / 100;
        const solidDasharrayPart = solidLength + adjustment;

        const targetDashPattern = lineConfig?.dashPattern || dashPattern;
        const patternSegmentLength =
          (targetDashPattern?.[0] || 0) + (targetDashPattern?.[1] || 0) || 1;
        const repetitions = Math.ceil(dashedLength / patternSegmentLength);
        const dashedPatternSegments = Array.from({ length: repetitions }, () =>
          targetDashPattern.join(" ")
        );

        const finalDasharray = `${solidDasharrayPart} ${dashedPatternSegments.join(
          " "
        )}`;
        newLineDasharrays.push({
          name,
          strokeDasharray: finalDasharray,
        });
      });

      if (
        JSON.stringify(newLineDasharrays) !== JSON.stringify(lineDasharrays)
      ) {
        setTimeout(() => setLineDasharrays(newLineDasharrays), 0);
      }

      return null;
    },
    [splitIndex, curveAdjustment, lineConfigs, dashPattern, lineDasharrays]
  );

  return [DasharrayCalculator, lineDasharrays];
}
