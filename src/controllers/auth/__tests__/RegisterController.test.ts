import request from "supertest";
import app from "../../../app";
import UserModel from "../../../models/UserModel";

describe("RegisterController", () => {
    describe("POST /api/auth/register", () => {
        const mockUser = {
            username: "newuser",
            password: "password123",
            confirmPassword: "password123",
        };

        it("should successfully register a new user", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send(mockUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Account created successfully");

            const user = await UserModel.findOne({
                username: mockUser.username,
            }).exec();

            expect(user).toBeTruthy();
            expect(user?.username).toBe(mockUser.username);
        });

        it("should return 409 if username is already in use", async () => {
            await UserModel.create({ ...mockUser, role: "client" });

            const response = await request(app)
                .post("/api/auth/register")
                .send(mockUser);

            expect(response.status).toBe(409);
            expect(response.body.message).toBe("Username already in use");
        });
    });
});
