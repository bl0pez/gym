
import { getRoutines } from "@/actions/routine-actions";
import { RoutinesClient } from "./routines-client";

export default async function RoutinesPage() {
  const { data: routines, error } = await getRoutines();

  if (error) {
    // In a real app, you might want to show an error boundary or a specific error UI
    console.error("Failed to fetch routines:", error);
  }

  return <RoutinesClient initialRoutines={routines || []} />;
}

