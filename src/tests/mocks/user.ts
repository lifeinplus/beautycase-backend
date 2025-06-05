import type { User } from "../../models/UserModel";

export const mockUser: User = {
    password: "securepassword",
    refreshTokens: [],
    role: "admin",
    username: "Admin",
};
