import type { UserJwtPayload } from "../../types/auth";

export const mockRole = "client";

export const mockToken1: string = "token1";
export const mockToken2: string = "token2";

export const mockTokens: string[] = [mockToken1, mockToken2];

export const mockHacker = {
    username: "hacker",
    password: "password123",
};

export const mockUser1 = {
    username: "testuser1",
    password: "password1",
};

export const mockUser2 = {
    username: "testuser2",
    password: "password2",
};

export const mockUserJwt: UserJwtPayload = {
    role: "admin",
    userId: "adminId",
    username: "admin",
};

export const mockUserRegister = {
    username: "newuser",
    password: "password123",
    confirmPassword: "password123",
};
