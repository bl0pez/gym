"use server";

import { revalidateTag } from "next/cache";
import apiServer from "@/lib/api-server";
import { CreateRoutineDto, UpdateRoutineDto, Routine, ActionResponse } from "@/types";

const ROUTINE_TAG = "routines";

export async function getRoutines(): Promise<ActionResponse<Routine[]>> {
  return apiServer.get<Routine[]>("/routines", [ROUTINE_TAG]);
}

export async function createRoutine(data: CreateRoutineDto): Promise<ActionResponse<Routine>> {
  const res = await apiServer.post<Routine>("/routines", data);
  if (!res.error) {
    revalidateTag(ROUTINE_TAG, "max");
  }
  return res;
}

export async function updateRoutine(id: string, data: UpdateRoutineDto): Promise<ActionResponse<Routine>> {
  const res = await apiServer.patch<Routine>(`/routines/${id}`, data);
  if (!res.error) {
    revalidateTag(ROUTINE_TAG, "max");
  }
  return res;
}

export async function deleteRoutine(id: string): Promise<ActionResponse<void>> {
  const res = await apiServer.delete<void>(`/routines/${id}`);
  if (!res.error) {
    revalidateTag(ROUTINE_TAG, "max");
  }
  return res;
}
