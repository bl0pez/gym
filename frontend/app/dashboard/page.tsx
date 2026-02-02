
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import apiServer from "@/lib/api-server"
import Link from "next/link"

export default async function DashboardPage() {
  let stats = { routines: 0 };
  
  try {
    const res = await apiServer.get('/routines');
    stats.routines = res.data.length;
  } catch (e) {
    console.error("Failed to fetch routines in SSR:", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your training hub.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Routines
            </CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.routines}</div>
            <p className="text-xs text-muted-foreground">
              Active training plans
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
      </div>
      
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard/routines">
             Create New Routine
          </Link>
        </Button>
      </div>
    </div>
  )
}
