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
    CLOUDINARY_CLOUD_NAME = "",
    CLOUDINARY_API_KEY = "",
    CLOUDINARY_API_SECRET = "",
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
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
    },
    passwordLengthMin: parseInt(PASSWORD_LENGTH_MIN),
};

const cloudinary = {
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
};

const cors: CorsOptions = {
    credentials: CORS_CREDENTIALS.toLowerCase() === "true",
    origin: CORS_ORIGIN,
};

const config = {
    auth,
    cloudinary,
    cors,
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
};

export default config;
