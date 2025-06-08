import supertest from "supertest";

import app from "../../../app";
import UserModel from "../../../models/UserModel";
import { mockRole, mockUserRegister } from "../../../tests/mocks/auth";

const request = supertest(app);
const path = "/api/auth/register";

describe("RegisterController", () => {
    describe("POST /api/auth/register", () => {
        it("should register a user", async () => {
            const response = await request.post(path).send(mockUserRegister);

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe("Account created successfully");

            const user = await UserModel.findOne({
                username: mockUserRegister.username,
            }).exec();

            expect(user).toBeTruthy();
            expect(user?.username).toBe(mockUserRegister.username);
        });

        it("should return 409 if username is already in use", async () => {
            await UserModel.create({ ...mockUserRegister, role: mockRole });

            const response = await request.post(path).send(mockUserRegister);

            expect(response.statusCode).toBe(409);
            expect(response.body.message).toBe("Username already in use");
        });
    });
});
