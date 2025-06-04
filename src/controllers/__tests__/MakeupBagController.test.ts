import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as MakeupBagService from "../../services/MakeupBagService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";
import {
    mockMakeupBag1,
    mockMakeupBag2,
    mockMakeupBagId,
} from "../../tests/mocks/makeupBag";

jest.mock("../../services/MakeupBagService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("MakeupBagController", () => {
    describe("POST /api/makeup-bags", () => {
        it("should create a makeup bag", async () => {
            jest.mocked(
                MakeupBagService.createMakeupBag as jest.Mock
            ).mockResolvedValue({ _id: mockMakeupBagId });

            const res = await request
                .post("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag1)
                .expect(201);

            expect(res.body).toEqual({
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
            mockCreateMakeupBag.mockRejectedValue(mockError);

            const res = await request
                .post("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag1)
                .expect(500);

            expect(res.body.message).toEqual(mockError.message);
            expect(MakeupBagService.createMakeupBag).toHaveBeenCalledWith(
                mockMakeupBag1
            );

            mockCreateMakeupBag.mockRestore();
        });
    });

    describe("GET /api/makeup-bags", () => {
        it("should get all makeupBags", async () => {
            const mockMakeupBags = [mockMakeupBag1, mockMakeupBag2];

            jest.mocked(
                MakeupBagService.getAllMakeupBags as jest.Mock
            ).mockResolvedValue(mockMakeupBags);

            const res = await request
                .get("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body).toEqual(mockMakeupBags);
            expect(MakeupBagService.getAllMakeupBags).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all makeupBags fails", async () => {
            const mockGetAllMakeupBags = jest.spyOn(
                MakeupBagService,
                "getAllMakeupBags"
            );

            mockGetAllMakeupBags.mockRejectedValue(mockError);

            const res = await request
                .get("/api/makeup-bags")
                .set("Authorization", `Bearer ${token}`)
                .expect(500);

            expect(res.body.message).toEqual(mockError.message);
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

            const res = await request
                .get(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body).toEqual(mockResult);
            expect(MakeupBagService.getMakeupBagById).toHaveBeenCalledTimes(1);
            expect(MakeupBagService.getMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId
            );
        });

        it("should return 500 if makeupBag not found", async () => {
            const mockGetMakeupBagById = jest.spyOn(
                MakeupBagService,
                "getMakeupBagById"
            );

            mockGetMakeupBagById.mockRejectedValue(mockError);

            const res = await request
                .get(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(500);

            expect(res.body.message).toBe(mockError.message);
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

            const res = await request
                .put(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag2)
                .expect(200);

            expect(res.body).toEqual({
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

            mockUpdateMakeupBagById.mockRejectedValue(mockError);

            const res = await request
                .put(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockMakeupBag1)
                .expect(500);

            expect(res.body.message).toBe(mockError.message);
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

            const res = await request
                .delete(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body).toEqual({
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

            mockDeleteMakeupBagById.mockRejectedValue(mockError);

            const res = await request
                .delete(`/api/makeup-bags/${mockMakeupBagId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(500);

            expect(res.body.message).toBe(mockError.message);
            expect(MakeupBagService.deleteMakeupBagById).toHaveBeenCalledWith(
                mockMakeupBagId
            );

            mockDeleteMakeupBagById.mockRestore();
        });
    });
});
