import { User } from './user.model';

export interface LoginRequest {
    username: string; // Matches backend email field in security context
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    id?: number;
    nombre?: string;
    apellidos?: string;
    correo?: string;
    rol?: string;
}

export interface RegisterRequest {
    nombre: string;
    apellidos: string;
    email: string;
    password1: string;
    password2: string;
    rol: string;
    telefono?: string;
}

export interface RefreshRequest {
    refresh: string;
}
