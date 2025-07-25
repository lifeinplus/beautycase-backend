import supertest from "supertest";

import app from "../../app";
import { signAccessToken } from "../../services/auth/TokenService";
import * as MakeupBagService from "../../services/MakeupBagService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockDatabaseError } from "../../tests/mocks/error";
import {
    mockMakeupBag1,
    mockMakeupBag2,
    mockMakeupBagId,
    mockMakeupBags,
} from "../../tests/mocks/makeupBag";

jest.mock("../../services/MakeupBagService");

const request = supertest(app);

let token: string;

beforeAll(async () => {
    token = signAccessToken(mockUserJwt);
});

describe("MakeupBagController", () => {
    describe("POST /api/makeup-bags", () => {
        it("should create a makeup bag", async () => {
            jest.mocked(
                MakeupBagService.createMakeupBag as jest.Mock
            ).mockResolvedValue({ _id: mockMakeupBagId });

            const response = await request
                .post("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag1);

            expect(response.statusCode).toBe(201);

            expect(response.body).toEqual({
                id: mockMakeupBagId,
                message: "MakeupBag created successfully",
            });

            expect(MakeupBagService.createMakeupBag).toHaveBeenCalledWith(
                mockMakeupBag1
            );
        });

        it("should return 500 if creating a makeup bag fails", async () => {
            const mockCreateMakeupBag = jest.spyOn(
                MakeupBagService,
                "createMakeupBag"
            );

            mockCreateMakeupBag.mockRejectedValue(mockDatabaseError);

            const response = await request
                .post("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag1);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockDatabaseError.message);

            expect(MakeupBagService.createMakeupBag).toHaveBeenCalledWith(
                mockMakeupBag1
            );

            mockCreateMakeupBag.mockRestore();
        });
    });

    describe("GET /api/makeup-bags", () => {
        it("should get all makeup bags", async () => {
            jest.mocked(
                MakeupBagService.getAllMakeupBags as jest.Mock
            ).mockResolvedValue(mockMakeupBags);

            const response = await request
                .get("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockMakeupBags);
            expect(MakeupBagService.getAllMakeupBags).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all makeup bags fails", async () => {
            const mockGetAllMakeupBags = jest.spyOn(
                MakeupBagService,
                "getAllMakeupBags"
            );

            mockGetAllMakeupBags.mockRejectedValue(mockDatabaseError);

            const response = await request
                .get("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockDatabaseError.message);

            expect(MakeupBagService.getAllMakeupBags).toHaveBeenCalledTimes(1);

            mockGetAllMakeupBags.mockRestore();
        });
    });

    describe("GET /api/makeup-bags/:id", () => {
        it("should get a makeup bag", async () => {
            const mockResult = { _id: mockMakeupBagId, ...mockMakeupBag1 };

            jest.mocked(
                MakeupBagService.getMakeupBagById as jest.Mock
            ).mockResolvedValue(mockResult);

            const response = await request
                .get(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResult);

            expect(MakeupBagService.getMakeupBagById).toHaveBeenCalledTimes(1);
            expect(MakeupBagService.getMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId
            );
        });

        it("should return 500 if getting a makeup bag fails", async () => {
            const mockGetMakeupBagById = jest.spyOn(
                MakeupBagService,
                "getMakeupBagById"
            );

            mockGetMakeupBagById.mockRejectedValue(mockDatabaseError);

            const response = await request
                .get(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockDatabaseError.message);

            expect(MakeupBagService.getMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId
            );

            mockGetMakeupBagById.mockRestore();
        });
    });

    describe("PUT /api/makeup-bags/:id", () => {
        it("should update a makeup bag", async () => {
            jest.mocked(
                MakeupBagService.updateMakeupBagById as jest.Mock
            ).mockResolvedValue({ _id: mockMakeupBagId });

            const response = await request
                .put(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag2);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual({
                id: mockMakeupBagId,
                message: "MakeupBag updated successfully",
            });

            expect(MakeupBagService.updateMakeupBagById).toHaveBeenCalledTimes(
                1
            );
            expect(MakeupBagService.updateMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId,
                mockMakeupBag2
            );
        });

        it("should return 500 if updating a makeup bag fails", async () => {
            const mockUpdateMakeupBagById = jest.spyOn(
                MakeupBagService,
                "updateMakeupBagById"
            );

            mockUpdateMakeupBagById.mockRejectedValue(mockDatabaseError);

            const response = await request
                .put(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag1);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockDatabaseError.message);

            expect(MakeupBagService.updateMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId,
                mockMakeupBag1
            );

            mockUpdateMakeupBagById.mockRestore();
        });
    });

    describe("DELETE /api/makeup-bags/:id", () => {
        it("should delete a makeup bag", async () => {
            jest.mocked(
                MakeupBagService.deleteMakeupBagById as jest.Mock
            ).mockResolvedValue({ _id: mockMakeupBagId });

            const response = await request
                .delete(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual({
                id: mockMakeupBagId,
                message: "MakeupBag deleted successfully",
            });

            expect(MakeupBagService.deleteMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId
            );
        });

        it("should return 500 if deleting a makeup bag fails", async () => {
            const mockDeleteMakeupBagById = jest.spyOn(
                MakeupBagService,
                "deleteMakeupBagById"
            );

            mockDeleteMakeupBagById.mockRejectedValue(mockDatabaseError);

            const response = await request
                .delete(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockDatabaseError.message);

            expect(MakeupBagService.deleteMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId
            );

            mockDeleteMakeupBagById.mockRestore();
        });
    });
});
