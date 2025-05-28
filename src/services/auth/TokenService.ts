import jwt from "jsonwebtoken";

import config from "../../config";
import type { AuthUser, UserJwtPayload } from "../../types/auth";

export const filterRefreshTokens = (
    existingTokens: string[],
    tokenToRemove?: string
): string[] => {
    return existingTokens.filter((token) => token !== tokenToRemove);
};

export const signAccessToken = (user: AuthUser): string => {
    const { role, userId, username } = user;
    return jwt.sign(
        { role, userId, username },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
};

export const signRefreshToken = (username: string): string => {
    return jwt.sign(
        { username },
        config.auth.refreshToken.secret,
        config.auth.refreshToken.options
    );
};

export const verifyRefreshToken = (token: string): UserJwtPayload => {
    return jwt.verify(token, config.auth.refreshToken.secret) as UserJwtPayload;
};
