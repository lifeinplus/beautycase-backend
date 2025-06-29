import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import type { Role } from "../models/UserModel";

export interface AuthUser {
    role: Role;
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
    role?: Role;
}

export interface UserJwtPayload extends JwtPayload {
    role: Role;
    userId: string;
    username: string;
}

export interface UserRequest extends Request {
    user?: AuthUser;
}
