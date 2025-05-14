import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

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
