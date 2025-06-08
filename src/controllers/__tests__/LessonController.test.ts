import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as LessonService from "../../services/LessonService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockErrorDatabase } from "../../tests/mocks/error";
import {
    mockLesson1,
    mockLesson2,
    mockLessonId,
} from "../../tests/mocks/lesson";

jest.mock("../../services/LessonService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("LessonController", () => {
    describe("POST /api/lessons", () => {
        it("should create a lesson", async () => {
            jest.mocked(
                LessonService.createLesson as jest.Mock
            ).mockResolvedValue({ _id: mockLessonId });

            const response = await request
                .post("/api/lessons")
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(response.statusCode).toBe(201);

            expect(response.body).toEqual({
                id: mockLessonId,
                message: "Lesson created successfully",
            });

            expect(LessonService.createLesson).toHaveBeenCalledWith(
                mockLesson1
            );
        });

        it("should return 500 if creating a lesson fails", async () => {
            const mockCreateLesson = jest.spyOn(LessonService, "createLesson");
            mockCreateLesson.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .post("/api/lessons")
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockErrorDatabase.message);

            expect(LessonService.createLesson).toHaveBeenCalledWith(
                mockLesson1
            );

            mockCreateLesson.mockRestore();
        });
    });

    describe("GET /api/lessons", () => {
        it("should get all lessons", async () => {
            const mockLessons = [mockLesson1, mockLesson2];

            jest.mocked(
                LessonService.getAllLessons as jest.Mock
            ).mockResolvedValue(mockLessons);

            const response = await request
                .get("/api/lessons")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockLessons);
            expect(LessonService.getAllLessons).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all lessons fails", async () => {
            const mockGetAllLessons = jest.spyOn(
                LessonService,
                "getAllLessons"
            );

            mockGetAllLessons.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get("/api/lessons")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockErrorDatabase.message);

            expect(LessonService.getAllLessons).toHaveBeenCalledTimes(1);

            mockGetAllLessons.mockRestore();
        });
    });

    describe("GET /api/lessons/:id", () => {
        it("should get a lesson", async () => {
            const mockResult = { _id: mockLessonId, ...mockLesson1 };

            jest.mocked(
                LessonService.getLessonById as jest.Mock
            ).mockResolvedValue(mockResult);

            const response = await request
                .get(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResult);
            expect(LessonService.getLessonById).toHaveBeenCalledTimes(1);
            expect(LessonService.getLessonById).toHaveBeenCalledWith(
                mockLessonId
            );
        });

        it("should return 500 if getting a lesson fails", async () => {
            const mockGetLessonById = jest.spyOn(
                LessonService,
                "getLessonById"
            );

            mockGetLessonById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(LessonService.getLessonById).toHaveBeenCalledWith(
                mockLessonId
            );

            mockGetLessonById.mockRestore();
        });
    });

    describe("PUT /api/lessons/:id", () => {
        it("should update a lesson", async () => {
            jest.mocked(
                LessonService.updateLessonById as jest.Mock
            ).mockResolvedValue({ _id: mockLessonId });

            const response = await request
                .put(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson2);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual({
                id: mockLessonId,
                message: "Lesson updated successfully",
            });

            expect(LessonService.updateLessonById).toHaveBeenCalledTimes(1);
            expect(LessonService.updateLessonById).toHaveBeenCalledWith(
                mockLessonId,
                mockLesson2
            );
        });

        it("should return 500 if updating a lesson fails", async () => {
            const mockUpdateLessonById = jest.spyOn(
                LessonService,
                "updateLessonById"
            );

            mockUpdateLessonById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .put(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(LessonService.updateLessonById).toHaveBeenCalledWith(
                mockLessonId,
                mockLesson1
            );

            mockUpdateLessonById.mockRestore();
        });
    });

    describe("DELETE /api/lessons/:id", () => {
        it("should delete a lesson", async () => {
            jest.mocked(
                LessonService.deleteLessonById as jest.Mock
            ).mockResolvedValue({ _id: mockLessonId });

            const response = await request
                .delete(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual({
                id: mockLessonId,
                message: "Lesson deleted successfully",
            });

            expect(LessonService.deleteLessonById).toHaveBeenCalledWith(
                mockLessonId
            );
        });

        it("should return 500 if deleting a lesson fails", async () => {
            const mockDeleteLessonById = jest.spyOn(
                LessonService,
                "deleteLessonById"
            );

            mockDeleteLessonById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .delete(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(LessonService.deleteLessonById).toHaveBeenCalledWith(
                mockLessonId
            );

            mockDeleteLessonById.mockRestore();
        });
    });
});
