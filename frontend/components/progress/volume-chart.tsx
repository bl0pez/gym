"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from "@/components/ui/chart"

const chartConfig = {
  volume: {
    label: "Volume",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface VolumeChartProps {
  data: {
    date: string
    volume: number
  }[]
}

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="text-[10px] uppercase font-bold text-muted-foreground"
        />
        <YAxis 
           tickLine={false}
           axisLine={false}
           className="text-[10px] text-muted-foreground"
           tickFormatter={(val) => `${val}kg`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar 
          dataKey="volume" 
          fill="var(--color-volume)" 
          radius={[4, 4, 0, 0]} 
          barSize={32}
        />
      </BarChart>
    </ChartContainer>
  )
}
