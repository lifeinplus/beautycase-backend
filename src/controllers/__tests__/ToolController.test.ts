import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as ToolService from "../../services/ToolService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockErrorDatabase } from "../../tests/mocks/error";
import { mockTool1, mockTool2, mockToolId } from "../../tests/mocks/tool";

jest.mock("../../services/ToolService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("ToolController", () => {
    describe("POST /api/tools", () => {
        it("should create a tool", async () => {
            jest.mocked(ToolService.createTool as jest.Mock).mockResolvedValue({
                _id: mockToolId,
            });

            const response = await request
                .post("/api/tools")
                .set("Authorization", `Bearer ${token}`)
                .send(mockTool2);

            expect(response.statusCode).toBe(201);

            expect(response.body).toEqual({
                id: mockToolId,
                message: "Tool created successfully",
            });

            expect(ToolService.createTool).toHaveBeenCalledWith(mockTool2);
        });

        it("should return 500 if creating a tool fails", async () => {
            const mockCreateTool = jest.spyOn(ToolService, "createTool");

            mockCreateTool.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .post("/api/tools")
                .set("Authorization", `Bearer ${token}`)
                .send(mockTool2);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockErrorDatabase.message);

            expect(ToolService.createTool).toHaveBeenCalledWith(mockTool2);

            mockCreateTool.mockRestore();
        });
    });

    describe("GET /api/tools", () => {
        it("should get all tools (imageUrl only)", async () => {
            const mockTools = [mockTool1, mockTool2];

            jest.mocked(ToolService.getAllTools as jest.Mock).mockResolvedValue(
                mockTools
            );

            const response = await request
                .get("/api/tools")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockTools);
            expect(ToolService.getAllTools).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all tools fails", async () => {
            const mockGetAllTools = jest.spyOn(ToolService, "getAllTools");

            mockGetAllTools.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get("/api/tools")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockErrorDatabase.message);
            expect(ToolService.getAllTools).toHaveBeenCalledTimes(1);

            mockGetAllTools.mockRestore();
        });
    });

    describe("GET /api/tools/:id", () => {
        it("should get a tool", async () => {
            const mockResult = { _id: mockToolId, ...mockTool1 };

            jest.mocked(ToolService.getToolById as jest.Mock).mockResolvedValue(
                mockResult
            );

            const response = await request
                .get(`/api/tools/${mockToolId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResult);

            expect(ToolService.getToolById).toHaveBeenCalledTimes(1);
            expect(ToolService.getToolById).toHaveBeenCalledWith(mockToolId);
        });

        it("should return 500 if getting a tool fails", async () => {
            const mockGetToolById = jest.spyOn(ToolService, "getToolById");

            mockGetToolById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get(`/api/tools/${mockToolId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(ToolService.getToolById).toHaveBeenCalledWith(mockToolId);

            mockGetToolById.mockRestore();
        });
    });

    describe("PUT /api/tools/:id", () => {
        it("should update a tool", async () => {
            jest.mocked(
                ToolService.updateToolById as jest.Mock
            ).mockResolvedValue({ _id: mockToolId });

            const response = await request
                .put(`/api/tools/${mockToolId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockTool2);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual({
                id: mockToolId,
                message: "Tool updated successfully",
            });

            expect(ToolService.updateToolById).toHaveBeenCalledTimes(1);
            expect(ToolService.updateToolById).toHaveBeenCalledWith(
                mockToolId,
                mockTool2
            );
        });

        it("should return 500 if updating a tool fails", async () => {
            const mockUpdateToolById = jest.spyOn(
                ToolService,
                "updateToolById"
            );

            mockUpdateToolById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .put(`/api/tools/${mockToolId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockTool2);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(ToolService.updateToolById).toHaveBeenCalledWith(
                mockToolId,
                mockTool2
            );

            mockUpdateToolById.mockRestore();
        });
    });

    describe("DELETE /api/tools/:id", () => {
        it("should delete a tool", async () => {
            jest.mocked(
                ToolService.deleteToolById as jest.Mock
            ).mockResolvedValue({ _id: mockToolId });

            const response = await request
                .delete(`/api/tools/${mockToolId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual({
                id: mockToolId,
                message: "Tool deleted successfully",
            });

            expect(ToolService.deleteToolById).toHaveBeenCalledWith(mockToolId);
        });

        it("should return 500 if deleting a tool fails", async () => {
            const mockDeleteToolById = jest.spyOn(
                ToolService,
                "deleteToolById"
            );

            mockDeleteToolById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .delete(`/api/tools/${mockToolId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(ToolService.deleteToolById).toHaveBeenCalledWith(mockToolId);

            mockDeleteToolById.mockRestore();
        });
    });
});
