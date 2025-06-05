import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../../app";
import config from "../../../config";
import UserModel from "../../../models/UserModel";
import {
    mockHacker,
    mockRole,
    mockUser1,
    mockUser2,
} from "../../../tests/mocks/auth";

const request = supertest(app);
const path = "/api/auth/refresh";

describe("RefreshController", () => {
    describe("GET /api/auth/refresh", () => {
        it("should handle token reuse and clear hacked user tokens", async () => {
            const hackerToken = jwt.sign(
                { username: mockHacker.username },
                config.auth.refreshToken.secret,
                config.auth.refreshToken.options
            );

            await UserModel.create({
                username: mockHacker.username,
                password: mockHacker.password,
                role: mockRole,
                refreshTokens: [hackerToken],
            });

            // Simulate reuse: token not in DB but valid
            await UserModel.updateOne(
                { username: mockHacker.username },
                { $set: { refreshTokens: [] } }
            );

            const response = await request
                .get(path)
                .set("Cookie", [`jwt=${hackerToken}`]);

            expect(response.status).toBe(401);

            const user = await UserModel.findOne({
                username: mockHacker.username,
            });
            expect(user?.refreshTokens.length).toBe(0);
        });

        it("should refresh token and return new tokens", async () => {
            const refreshToken = jwt.sign(
                { username: mockUser1.username },
                config.auth.refreshToken.secret,
                config.auth.refreshToken.options
            );

            await UserModel.create({
                username: mockUser1.username,
                password: mockUser1.password,
                role: mockRole,
                refreshTokens: [refreshToken],
            });

            const response = await request
                .get(path)
                .set("Cookie", [`jwt=${refreshToken}`]);

            expect(response.status).toBe(200);
            expect(response.headers["set-cookie"]).toBeDefined();
            expect(response.headers["set-cookie"][0]).toContain("jwt=");

            expect(response.body).toHaveProperty("accessToken");
            expect(response.body).toHaveProperty("role", mockRole);
            expect(response.body).toHaveProperty(
                "username",
                mockUser1.username
            );
        });

        it("should handle expired refresh token and update stored tokens", async () => {
            const expiredToken = jwt.sign(
                { username: mockUser1.username },
                config.auth.refreshToken.secret,
                { expiresIn: -1 }
            );

            await UserModel.create({
                username: mockUser1.username,
                password: mockUser1.password,
                role: mockRole,
                refreshTokens: [expiredToken],
            });

            const res = await request
                .get(path)
                .set("Cookie", [`jwt=${expiredToken}`]);

            expect(res.statusCode).toBe(500);

            const user = await UserModel.findOne({
                username: mockUser1.username,
            });

            expect(user?.refreshTokens).toEqual([]);
        });

        it("should return 401 if no jwt cookie is present", async () => {
            const response = await request.get(path);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Refresh token not found");
        });

        it("should return 401 when username in token doesn't match", async () => {
            const refreshToken = jwt.sign(
                { username: mockUser1.username },
                config.auth.refreshToken.secret,
                config.auth.refreshToken.options
            );

            await UserModel.create({
                username: mockUser2.username,
                password: mockUser2.password,
                role: mockRole,
                refreshTokens: [refreshToken],
            });

            const res = await request
                .get(path)
                .set("Cookie", [`jwt=${refreshToken}`]);

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Username incorrect");
        });
    });
});
