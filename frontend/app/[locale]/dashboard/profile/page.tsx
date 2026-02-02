
import apiServer from "@/lib/api-server"
import { ProfileClient } from "./profile-client"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  let user = null;
  try {
    const { data } = await apiServer.get("/auth/profile")
    user = data;
  } catch (error) {
    console.error("Failed to fetch profile in SSR:", error)
    redirect("/auth/login")
  }

  return <ProfileClient user={user} />
}
