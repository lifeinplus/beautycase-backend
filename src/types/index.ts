import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserJwtPayload extends JwtPayload {
    username: string;
}

export interface UserRequest extends Request {
    userId?: string;
}
