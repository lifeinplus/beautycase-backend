import bcrypt from "bcrypt";
import supertest from "supertest";

import app from "../../../app";
import UserModel from "../../../models/UserModel";
import { mockRole, mockUser1, mockUser2 } from "../../../tests/mocks/auth";

const request = supertest(app);

describe("LoginController POST", () => {
    const path = "/api/auth/login";

    beforeEach(async () => {
        const password = await bcrypt.hash(mockUser1.password, 10);
        await UserModel.create({
            username: mockUser1.username,
            password,
            role: mockRole,
            refreshTokens: [],
        });
    });

    it("should login successfully and return access token", async () => {
        const response = await request.post(path).send(mockUser1);

        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty("accessToken");
        expect(response.body.username).toBe(mockUser1.username);
        expect(response.body.role).toBe(mockRole);
        expect(response.body.userId).toBeDefined();

        expect(response.headers["set-cookie"]).toBeDefined();
        expect(response.headers["set-cookie"][0]).toContain("jwt=");

        const updatedUser = await UserModel.findOne({
            username: mockUser1.username,
        });

        expect(updatedUser?.refreshTokens.length).toBe(1);
    });

    it("should return 401 when user does not exist", async () => {
        const response = await request.post(path).send(mockUser2);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("User not found");
    });

    it("should return 401 when password is incorrect", async () => {
        const response = await request.post(path).send({
            username: mockUser1.username,
            password: mockUser2.password,
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Password is incorrect");
    });

    it("should handle existing refresh token and create a new one", async () => {
        const firstLogin = await request.post(path).send(mockUser1);

        const cookies = firstLogin.headers["set-cookie"][0];
        const refreshToken = cookies.split(";")[0].split("=")[1];

        const user = await UserModel.findOne({
            username: mockUser1.username,
        });

        expect(user?.refreshTokens).toContain(refreshToken);

        const secondLogin = await request
            .post(path)
            .set("Cookie", `jwt=${refreshToken}`)
            .send(mockUser1);

        expect(secondLogin.status).toBe(200);

        // Verify old token is removed and new one is added
        const updatedUser = await UserModel.findOne({
            username: mockUser1.username,
        });

        expect(updatedUser?.refreshTokens.length).toBe(1);
    });

    it("should clear all refresh tokens when token reuse is detected", async () => {
        const firstLogin = await request.post(path).send(mockUser1);

        const cookies = firstLogin.headers["set-cookie"][0];
        const refreshToken = cookies.split(";")[0].split("=")[1];

        // Simulate token being stolen and removed from DB
        const user = await UserModel.findOne({
            username: mockUser1.username,
        });

        user!.refreshTokens = [];
        await user!.save();

        const secondLogin = await request
            .post(path)
            .set("Cookie", `jwt=${refreshToken}`)
            .send(mockUser1);

        expect(secondLogin.status).toBe(200);

        // Verify the user only has the new token
        const updatedUser = await UserModel.findOne({
            username: mockUser1.username,
        });

        expect(updatedUser?.refreshTokens.length).toBe(1);
    });
});
