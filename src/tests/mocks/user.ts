import type { User } from "../../models/UserModel";

export const mockUserId = "682a378b09c4df2756fcece5";

export const mockUser1: User = {
    password: "password1",
    refreshTokens: [],
    role: "admin",
    username: "user1",
};

export const mockUser2: User = {
    password: "password2",
    refreshTokens: [],
    role: "mua",
    username: "user2",
};
