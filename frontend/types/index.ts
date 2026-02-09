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
  sets: number;
  repetitions: number;
  weight: number;
}


export interface Routine {
  id: string;
  category: string;
  name: string;
  description: string | null;
  date: Date;
  sets: RoutineSet[];
  observations: string;
  videoUrls: string[];
  isTemplate: boolean;
  userId: string;
  programId: string | null;
  originalRoutineId: string | null;
  createdAt: string;
  updatedAt: string;
}

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

