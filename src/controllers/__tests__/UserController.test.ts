import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as UserService from "../../services/UserService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockErrorDatabase } from "../../tests/mocks/error";
import { mockMakeupBag1 } from "../../tests/mocks/makeupBag";
import { mockUser1, mockUser2, mockUserId } from "../../tests/mocks/user";

jest.mock("../../services/UserService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("UserController", () => {
    describe("GET /api/users", () => {
        it("should get all users (imageUrl only)", async () => {
            const mockUsers = [mockUser1, mockUser2];

            jest.mocked(UserService.getAllUsers as jest.Mock).mockResolvedValue(
                mockUsers
            );

            const response = await request
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockUsers);
            expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all users fails", async () => {
            const mockGetAllUsers = jest.spyOn(UserService, "getAllUsers");

            mockGetAllUsers.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockErrorDatabase.message);
            expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);

            mockGetAllUsers.mockRestore();
        });
    });

    describe("GET /api/users/:id", () => {
        it("should get a user", async () => {
            const mockResult = {
                user: { _id: mockUserId, ...mockUser1 },
                makeupBags: [mockMakeupBag1],
            };

            jest.mocked(UserService.getUserById as jest.Mock).mockResolvedValue(
                mockResult
            );

            const response = await request
                .get(`/api/users/${mockUserId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResult);

            expect(UserService.getUserById).toHaveBeenCalledTimes(1);
            expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);
        });

        it("should return 500 if getting a user fails", async () => {
            const mockGetUserById = jest.spyOn(UserService, "getUserById");

            mockGetUserById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get(`/api/users/${mockUserId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);

            mockGetUserById.mockRestore();
        });
    });
});
