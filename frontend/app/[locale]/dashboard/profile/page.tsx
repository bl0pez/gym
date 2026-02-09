import apiServer from "@/lib/api-server"
import { ProfileClient } from "./profile-client"
import { redirect } from "next/navigation"

import { User } from "@/types"

export default async function ProfilePage() {
  const { data: user, error } = await apiServer.get<User>("/auth/profile")


  if (error || !user) {
    console.error("Failed to fetch profile in SSR:", error)
    redirect("/auth/login")
  }

  return <ProfileClient user={user} />
}

