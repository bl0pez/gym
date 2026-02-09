import { getRoutines } from "@/actions/routine-actions";
import { RoutinesClient } from "./routines-client";

export default function RoutinesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routines</h1>
          <p className="text-muted-foreground">
            Manage and track your daily training.
          </p>
        </div>


          {/* Btn create */}
      </div>

      <div className="space-y-10">
        {/* Routines list */}
      </div>
    </div>
  );
  // const { data: routines, error } = await getRoutines();

  // if (error) {
  //   // In a real app, you might want to show an error boundary or a specific error UI
  //   console.error("Failed to fetch routines:", error);
  // }

  // return <RoutinesClient initialRoutines={routines || []} />;
}
