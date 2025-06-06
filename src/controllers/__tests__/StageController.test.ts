import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as StageService from "../../services/StageService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";
import { mockStage1, mockStage2, mockStageId } from "../../tests/mocks/stage";

jest.mock("../../services/StageService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("StageController", () => {
    describe("POST /api/stages", () => {
        it("should create a stage", async () => {
            jest.mocked(
                StageService.createStage as jest.Mock
            ).mockResolvedValue({ _id: mockStageId });

            const res = await request
                .post("/api/stages")
                .set("Authorization", `Bearer ${token}`)
                .send(mockStage1);

            expect(res.statusCode).toBe(201);

            expect(res.body).toEqual({
                id: mockStageId,
                message: "Stage created successfully",
            });

            expect(StageService.createStage).toHaveBeenCalledWith(mockStage1);
        });

        it("should return 500 if creating a stage fails", async () => {
            const mockCreateStage = jest.spyOn(StageService, "createStage");

            mockCreateStage.mockRejectedValue(mockError);

            const res = await request
                .post("/api/stages")
                .set("Authorization", `Bearer ${token}`)
                .send(mockStage1);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toEqual(mockError.message);

            expect(StageService.createStage).toHaveBeenCalledWith(mockStage1);

            mockCreateStage.mockRestore();
        });
    });

    describe("POST /api/stages/duplicate/:id", () => {
        it("should duplicate a stage", async () => {
            jest.mocked(
                StageService.duplicateStageById as jest.Mock
            ).mockResolvedValue({ _id: mockStageId });

            const res = await request
                .post(`/api/stages/duplicate/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(201);

            expect(res.body).toEqual({
                id: mockStageId,
                message: "Stage duplicated successfully",
            });

            expect(StageService.duplicateStageById).toHaveBeenCalledWith(
                mockStageId
            );
        });

        it("should return 500 if duplicating a stage fails", async () => {
            const mockDuplicateStageById = jest.spyOn(
                StageService,
                "duplicateStageById"
            );

            mockDuplicateStageById.mockRejectedValue(mockError);

            const res = await request
                .post(`/api/stages/duplicate/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toEqual(mockError.message);

            expect(StageService.duplicateStageById).toHaveBeenCalledWith(
                mockStageId
            );

            mockDuplicateStageById.mockRestore();
        });
    });

    describe("GET /api/stages", () => {
        it("should get all stages (imageUrl only)", async () => {
            const mockStages = [mockStage1, mockStage2];

            jest.mocked(
                StageService.getAllStages as jest.Mock
            ).mockResolvedValue(mockStages);

            const res = await request
                .get("/api/stages")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockStages);
            expect(StageService.getAllStages).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all stages fails", async () => {
            const mockGetAllStages = jest.spyOn(StageService, "getAllStages");

            mockGetAllStages.mockRejectedValue(mockError);

            const res = await request
                .get("/api/stages")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toEqual(mockError.message);
            expect(StageService.getAllStages).toHaveBeenCalledTimes(1);

            mockGetAllStages.mockRestore();
        });
    });

    describe("GET /api/stages/:id", () => {
        it("should get a stage", async () => {
            const mockResult = { _id: mockStageId, ...mockStage1 };

            jest.mocked(
                StageService.getStageById as jest.Mock
            ).mockResolvedValue(mockResult);

            const res = await request
                .get(`/api/stages/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockResult);

            expect(StageService.getStageById).toHaveBeenCalledTimes(1);
            expect(StageService.getStageById).toHaveBeenCalledWith(mockStageId);
        });

        it("should return 500 if getting a stage fails", async () => {
            const mockGetStageById = jest.spyOn(StageService, "getStageById");

            mockGetStageById.mockRejectedValue(mockError);

            const res = await request
                .get(`/api/stages/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

            expect(StageService.getStageById).toHaveBeenCalledWith(mockStageId);

            mockGetStageById.mockRestore();
        });
    });

    describe("PUT /api/stages/:id", () => {
        it("should update a stage", async () => {
            jest.mocked(
                StageService.updateStageById as jest.Mock
            ).mockResolvedValue({ _id: mockStageId });

            const res = await request
                .put(`/api/stages/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStage2);

            expect(res.statusCode).toBe(200);

            expect(res.body).toEqual({
                id: mockStageId,
                message: "Stage updated successfully",
            });

            expect(StageService.updateStageById).toHaveBeenCalledTimes(1);
            expect(StageService.updateStageById).toHaveBeenCalledWith(
                mockStageId,
                mockStage2
            );
        });

        it("should return 500 if updating a stage fails", async () => {
            const mockUpdateStageById = jest.spyOn(
                StageService,
                "updateStageById"
            );

            mockUpdateStageById.mockRejectedValue(mockError);

            const res = await request
                .put(`/api/stages/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStage2);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

            expect(StageService.updateStageById).toHaveBeenCalledWith(
                mockStageId,
                mockStage2
            );

            mockUpdateStageById.mockRestore();
        });
    });

    describe("DELETE /api/stages/:id", () => {
        it("should delete a stage", async () => {
            jest.mocked(
                StageService.deleteStageById as jest.Mock
            ).mockResolvedValue({ _id: mockStageId });

            const res = await request
                .delete(`/api/stages/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);

            expect(res.body).toEqual({
                id: mockStageId,
                message: "Stage deleted successfully",
            });

            expect(StageService.deleteStageById).toHaveBeenCalledWith(
                mockStageId
            );
        });

        it("should return 500 if deleting a stage fails", async () => {
            const mockDeleteStageById = jest.spyOn(
                StageService,
                "deleteStageById"
            );

            mockDeleteStageById.mockRejectedValue(mockError);

            const res = await request
                .delete(`/api/stages/${mockStageId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

            expect(StageService.deleteStageById).toHaveBeenCalledWith(
                mockStageId
            );

            mockDeleteStageById.mockRestore();
        });
    });
});
