import type { CorsOptions } from "cors";
import dotenv from "dotenv";
import type { CookieOptions } from "express";
import type { Secret, SignOptions } from "jsonwebtoken";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

interface Token {
    secret: Secret;
    options: SignOptions;
}

interface AuthOptions {
    accessToken: Token;
    refreshToken: Token;
    cookieOptions: CookieOptions;
    passwordLengthMin: number;
}

const {
    ACCESS_TOKEN_SECRET = "",
    ACCESS_TOKEN_EXPIRES_IN = "5m",
    REFRESH_TOKEN_SECRET = "",
    REFRESH_TOKEN_EXPIRES_IN = "1h",
    CORS_CREDENTIALS = "",
    CORS_ORIGIN = "",
    PASSWORD_LENGTH_MIN = "8",
} = process.env;

const auth: AuthOptions = {
    accessToken: {
        secret: ACCESS_TOKEN_SECRET,
        options: {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        },
    },
    refreshToken: {
        secret: REFRESH_TOKEN_SECRET,
        options: {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        },
    },
    cookieOptions: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
    passwordLengthMin: parseInt(PASSWORD_LENGTH_MIN),
};

const cors: CorsOptions = {
    credentials: CORS_CREDENTIALS.toLowerCase() === "true",
    origin: CORS_ORIGIN,
};

const config = {
    auth,
    cors,
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
};

export default config;
