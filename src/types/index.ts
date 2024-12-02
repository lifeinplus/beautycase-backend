import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserJwtPayload extends JwtPayload {
    userId: string;
    username: string;
}

export interface UserRequest extends Request {
    userId?: string;
    username?: string;
}
