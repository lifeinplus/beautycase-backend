import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as LessonService from "../../services/LessonService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";
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

            const res = await request
                .post("/api/lessons")
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(res.statusCode).toBe(201);

            expect(res.body).toEqual({
                id: mockLessonId,
                message: "Lesson created successfully",
            });

            expect(LessonService.createLesson).toHaveBeenCalledWith(
                mockLesson1
            );
        });

        it("should return 500 if creating a lesson fails", async () => {
            const mockCreateLesson = jest.spyOn(LessonService, "createLesson");
            mockCreateLesson.mockRejectedValue(mockError);

            const res = await request
                .post("/api/lessons")
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toEqual(mockError.message);

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

            const res = await request
                .get("/api/lessons")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockLessons);
            expect(LessonService.getAllLessons).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all lessons fails", async () => {
            const mockGetAllLessons = jest.spyOn(
                LessonService,
                "getAllLessons"
            );

            mockGetAllLessons.mockRejectedValue(mockError);

            const res = await request
                .get("/api/lessons")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toEqual(mockError.message);

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

            const res = await request
                .get(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockResult);
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

            mockGetLessonById.mockRejectedValue(mockError);

            const res = await request
                .get(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

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

            const res = await request
                .put(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson2);

            expect(res.statusCode).toBe(200);

            expect(res.body).toEqual({
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

            mockUpdateLessonById.mockRejectedValue(mockError);

            const res = await request
                .put(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

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

            const res = await request
                .delete(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);

            expect(res.body).toEqual({
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

            mockDeleteLessonById.mockRejectedValue(mockError);

            const res = await request
                .delete(`/api/lessons/${mockLessonId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

            expect(LessonService.deleteLessonById).toHaveBeenCalledWith(
                mockLessonId
            );

            mockDeleteLessonById.mockRestore();
        });
    });
});
