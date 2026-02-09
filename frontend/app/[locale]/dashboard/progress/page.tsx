import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp } from "lucide-react"
import apiServer from "@/lib/api-server"
import { VolumeChart } from "@/components/progress/volume-chart"
import { ExerciseProgress } from "@/components/progress/exercise-progress"
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Routine } from "@/types"

export default async function ProgressPage() {
  const { data: routinesData, error } = await apiServer.get<Routine[]>("/routines")
  const routines = routinesData || []

  if (error) {
     console.error("Failed to fetch routines for progress:", error)
     // Optionally handle error UI or redirect
  }


  // Calculate Stats
  const totalWorkouts = new Set(routines.map(r => r.date)).size
  
  const parseWeight = (w?: string) => {
    if (!w) return 0
    const match = w.match(/(\d+(\.\d+)?)/)
    return match ? parseFloat(match[1]) : 0
  }

  const totalVolume = routines.reduce((acc, r) => {
    const routineVolume = (r.sets || []).reduce((sAcc, s) => sAcc + (s.repetitions * parseWeight(s.weight)), 0)
    return acc + routineVolume
  }, 0)

  // Prepare Chart Data (Last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  }).map(day => format(day, "yyyy-MM-dd"))

  const chartData = last7Days.map(date => {
    const dayRoutines = routines.filter(r => r.date === date)
    const volume = dayRoutines.reduce((acc, r) => {
      const routineVolume = (r.sets || []).reduce((sAcc, s) => sAcc + (s.repetitions * parseWeight(s.weight)), 0)
      return acc + routineVolume
    }, 0)

    return {
      date: format(parseISO(date), "MMM d"),
      volume,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-muted-foreground">
          Track your fitness journey over time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-muted/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Workout Volume</CardTitle>
                    <CardDescription>Daily weight lifted (kg) over the last 7 days.</CardDescription>
                  </div>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {routines.length > 0 ? (
                  <VolumeChart data={chartData} />
                ) : (
                  <div className="h-[350px] flex flex-col items-center justify-center border-dashed border-2 rounded-md border-muted/30">
                      <Activity className="h-10 w-10 mb-2 opacity-10" />
                      <p className="text-muted-foreground text-sm">No training data available yet.</p>
                  </div>
                )}
            </CardContent>
        </Card>

        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your lifetime performance stats.</CardDescription>
            </CardHeader>
             <CardContent className="pt-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Workouts Completed</p>
                            <p className="text-3xl font-bold">{totalWorkouts}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-orange-500" />
                        </div>
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Volume Lifted</p>
                            <p className="text-3xl font-bold">{totalVolume.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                        </div>
                    </div>
                    
                    <div className="p-4 border rounded-xl border-dashed">
                      <p className="text-xs text-muted-foreground text-center">
                        Consistently tracking your volume helps ensure progressive overload and better results.
                      </p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <ExerciseProgress routines={routines} />
    </div>
  )
}
