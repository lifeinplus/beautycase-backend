import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthUser {
    role: string;
    userId: string;
    username: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface RefreshResult {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface RegisterCredentials {
    username: string;
    password: string;
    role?: string;
}

export interface UserJwtPayload extends JwtPayload {
    role: string;
    userId: string;
    username: string;
}

export interface UserRequest extends Request {
    role?: string;
    userId?: string;
    username?: string;
}
