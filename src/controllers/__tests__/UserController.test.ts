import supertest from "supertest";

import app from "../../app";
import { signAccessToken } from "../../services/auth/TokenService";
import * as UserService from "../../services/UserService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockDatabaseError } from "../../tests/mocks/error";
import { mockMakeupBag1 } from "../../tests/mocks/makeupBag";
import { mockUser1, mockUserId, mockUsers } from "../../tests/mocks/user";

jest.mock("../../services/UserService");

const request = supertest(app);

let token: string;

beforeAll(async () => {
    token = signAccessToken(mockUserJwt);
});

describe("UserController", () => {
    describe("GET /api/users", () => {
        it("should get all users (imageUrl only)", async () => {
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

            mockGetAllUsers.mockRejectedValue(mockDatabaseError);

            const response = await request
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockDatabaseError.message);
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

            mockGetUserById.mockRejectedValue(mockDatabaseError);

            const response = await request
                .get(`/api/users/${mockUserId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockDatabaseError.message);

            expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);

            mockGetUserById.mockRestore();
        });
    });
});
