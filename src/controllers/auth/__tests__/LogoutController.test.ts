import { NextFunction, Request, Response } from "express";
import supertest from "supertest";

import app from "../../../app";
import UserModel from "../../../models/UserModel";
import {
    mockRole,
    mockToken1,
    mockToken2,
    mockUser1,
} from "../../../tests/mocks/auth";
import { logoutUser } from "../LogoutController";
import { mockError } from "../../../tests/mocks/error";

const request = supertest(app);

describe("LogoutController POST", () => {
    const path = "/api/auth/logout";

    it("should return 204 if no JWT cookie exists", async () => {
        const response = await request.post(path);
        expect(response.status).toBe(204);
    });

    it("should clear JWT cookie and return 200 for successful logout", async () => {
        await UserModel.create({
            ...mockUser1,
            role: mockRole,
            refreshTokens: [mockToken1, mockToken2],
        });

        const response = await request
            .post(path)
            .set("Cookie", [`jwt=${mockToken1}`]);

        expect(response.status).toBe(200);
        expect(response.headers["set-cookie"][0]).toContain("jwt=;");

        const user = await UserModel.findOne({
            username: mockUser1.username,
        });

        expect(user).not.toBeNull();
        expect(user!.refreshTokens.includes(mockToken1)).toBe(false);
    });

    it("should pass errors to next middleware", async () => {
        jest.spyOn(UserModel, "findOne").mockImplementation(() => {
            throw mockError;
        });

        const mockReq = {
            cookies: { jwt: mockToken1 },
        } as unknown as Request;

        const mockRes = {
            clearCookie: jest.fn(),
            sendStatus: jest.fn(),
        } as unknown as Response;

        const mockNext = jest.fn() as NextFunction;

        await logoutUser(mockReq, mockRes, mockNext);

        expect(mockRes.clearCookie).toHaveBeenCalledWith("jwt");
        expect(mockNext).toHaveBeenCalledWith(mockError);

        expect(mockRes.sendStatus).not.toHaveBeenCalled();
    });
});
