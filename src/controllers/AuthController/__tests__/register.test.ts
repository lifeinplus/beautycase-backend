import request from "supertest";
import app from "../../../app";

describe("POST /api/auth/register", () => {
    it("should register a user", async () => {
        const response = await request(app).post("/api/auth/register").send({
            username: "Jane",
            password: "Test1234!",
            confirmPassword: "Test1234!",
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("message");
    });
});
