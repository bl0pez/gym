"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import apiServer from "@/lib/api-server";
import { LoginDto, RegisterDto, User, ActionResponse } from "@/types";

export async function loginAction(data: LoginDto): Promise<ActionResponse<User>> {
  const { result, response } = await apiServer.postFull<User>("/auth/login", data);
  
  if (result.error) {
    return result;
  }

  // Extract cookie from backend response and set it in Next.js
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const cookieStore = await cookies();
    // SIMPLE extraction of access_token. In produciton you might use a cookie parser.
    const tokenMatch = setCookie.match(/access_token=([^;]+)/);
    if (tokenMatch) {
      cookieStore.set("token", tokenMatch[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      // Also setting 'access_token' for compatibility with middleware if needed
      cookieStore.set("access_token", tokenMatch[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  }

  return result;
}


export async function registerAction(data: RegisterDto): Promise<ActionResponse<User>> {
  const res = await apiServer.post<User>("/auth/register", data);
  return res;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("access_token");
  
  // Also call backend logout to clear their side if needed
  await apiServer.post("/auth/logout", {});
  
  redirect("/auth/login");
}

export async function updateProfileAction(id: string, data: Partial<User>): Promise<ActionResponse<User>> {
  const res = await apiServer.patch<User>(`/users/${id}`, data);
  return res;
}

