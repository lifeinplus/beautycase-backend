import request from "supertest";

import app from "../../../app";
import UserModel from "../../../models/UserModel";
import { mockRole, mockUserRegister } from "../../../tests/mocks/auth";

describe("RegisterController POST", () => {
    it("should register a user", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send(mockUserRegister);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Account created successfully");

        const user = await UserModel.findOne({
            username: mockUserRegister.username,
        }).exec();

        expect(user).toBeTruthy();
        expect(user?.username).toBe(mockUserRegister.username);
    });

    it("should return 409 if username is already in use", async () => {
        await UserModel.create({ ...mockUserRegister, role: mockRole });

        const response = await request(app)
            .post("/api/auth/register")
            .send(mockUserRegister);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Username already in use");
    });
});
