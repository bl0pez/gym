
import apiServer from "@/lib/api-server"
import { RoutinesClient } from "./routines-client"

export default async function RoutinesPage() {
  let routines = []
  
  try {
    const { data } = await apiServer.get("/routines")
    routines = data
  } catch (error) {
    console.error("Failed to fetch routines in SSR:", error)
  }

  return <RoutinesClient initialRoutines={routines} />
}
