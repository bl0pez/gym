"use client"

import { useState, useMemo } from "react"
import { 
  Line, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis 
} from "recharts"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Target, TrendingUp, Weight } from "lucide-react"
import { format, parseISO } from "date-fns"

import { Routine } from "@/types"

interface ExerciseProgressProps {
  routines: Routine[]
}


const chartConfig = {
  maxWeight: {
    label: "Max Weight",
    color: "hsl(var(--primary))",
  },
  volume: {
    label: "Session Volume",
    color: "hsl(var(--primary) / 0.4)",
  },
} satisfies ChartConfig

export function ExerciseProgress({ routines }: ExerciseProgressProps) {
  const exerciseNames = useMemo(() => {
    return Array.from(new Set(routines.map(r => r.name))).sort()
  }, [routines])

  const [selectedExercise, setSelectedExercise] = useState<string>(exerciseNames[0] || "")

  const parseWeight = (w?: string) => {
    if (!w) return 0
    const match = w.match(/(\d+(\.\d+)?)/)
    return match ? parseFloat(match[1]) : 0
  }

  const chartData = useMemo(() => {
    if (!selectedExercise) return []

    const exerciseRoutines = routines
      .filter(r => r.name === selectedExercise)
      .sort((a, b) => a.date.localeCompare(b.date))

    // Group by date to get unique session points
    const sessionData = exerciseRoutines.reduce((acc, r) => {
      const date = r.date
      const maxWeight = Math.max(...(r.sets || []).map(s => parseWeight(s.weight)))
      const volume = (r.sets || []).reduce((sum, s) => sum + (s.repetitions * parseWeight(s.weight)), 0)

      if (!acc[date]) {
        acc[date] = { maxWeight, volume }
      } else {
        acc[date].maxWeight = Math.max(acc[date].maxWeight, maxWeight)
        acc[date].volume += volume
      }
      return acc
    }, {} as Record<string, { maxWeight: number, volume: number }>)

    return Object.entries(sessionData).map(([date, stats]) => ({
      date: format(parseISO(date), "MMM d, yyyy"),
      fullDate: date,
      maxWeight: stats.maxWeight,
      volume: stats.volume,
    }))
  }, [selectedExercise, routines])

  const stats = useMemo(() => {
    if (chartData.length === 0) return null
    const weights = chartData.map(d => d.maxWeight)
    const currentWeight = weights[weights.length - 1]
    const startingWeight = weights[0]
    const improvement = currentWeight - startingWeight
    const percentage = startingWeight > 0 ? (improvement / startingWeight) * 100 : 0
    
    return {
      currentWeight,
      improvement,
      percentage: percentage.toFixed(1)
    }
  }, [chartData])

  if (exerciseNames.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Exercise Progress</h2>
          <p className="text-sm text-muted-foreground">Track your performance for specific exercises.</p>
        </div>
        <Select value={selectedExercise} onValueChange={setSelectedExercise}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>
          <SelectContent>
            {exerciseNames.map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Progress Chart: {selectedExercise}</CardTitle>
              <CardDescription>Max weight (kg) and session volume trends.</CardDescription>
            </div>
            <Target className="h-4 w-4 text-primary opacity-50" />
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-[10px] text-muted-foreground font-medium"
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-[10px] text-muted-foreground font-medium"
                    tickFormatter={(v) => `${v}kg`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="maxWeight" 
                    stroke="var(--color-maxWeight)" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "var(--color-maxWeight)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="var(--color-volume)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    Not enough data for this exercise yet.
                </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider text-primary/70">Current 1RM Estimate</CardDescription>
              <CardTitle className="text-4xl font-black">{stats?.currentWeight || 0} <span className="text-sm font-normal text-muted-foreground">kg</span></CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-1 text-sm font-medium">
                  {stats && stats.improvement >= 0 ? (
                    <>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-500">+{stats.improvement}kg ({stats.percentage}%)</span>
                    </>
                  ) : stats ? (
                    <span className="text-red-500">{stats.improvement}kg ({stats.percentage}%)</span>
                  ) : null}
                  <span className="text-muted-foreground text-xs ml-1 font-normal text-nowrap">since first session</span>
               </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
             <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase font-bold tracking-wider">Top Achievement</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 rounded-full">
                      <Weight className="h-4 w-4 text-primary" />
                   </div>
                   <div>
                      <p className="text-lg font-bold">{Math.max(...(chartData.map(d => d.maxWeight) || [0]), 0)} kg</p>
                      <p className="text-[10px] text-muted-foreground text-nowrap">All-time record</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
