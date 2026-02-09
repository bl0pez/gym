export interface ActionResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RoutineSet {
  series: number;
  repetitions: number;
  weight?: string;
  rest?: string;
}

export interface Routine {
  id: string;
  name: string;
  category: string;
  date: string;
  sets: RoutineSet[];
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineFormValues {
  name: string;
  category: string;
  date: string;
  sets: RoutineSet[];
  observations: string;
}

export type CreateRoutineDto = RoutineFormValues;
export type UpdateRoutineDto = Partial<CreateRoutineDto>;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string[];
  isActive: boolean;
  avatarUrl?: string; // Added avatarUrl
  createdAt: string;
  updatedAt: string;
}


export interface AuthResponse {
  user: User;
  access_token?: string; // Optional because backend sets cookie
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

