import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import LessonModel from "../../models/LessonModel";
import type { Lesson } from "../../models/LessonModel";
import ProductModel from "../../models/ProductModel";
import type { Product } from "../../models/ProductModel";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";

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
    const mockId = "682a378b09c4df2756fcece5";

    const mockProduct: Product = {
        brandId: mockId,
        name: "Lipstick",
        imageUrl: "https://image.url/lipstick.png",
        comment: "Great product",
        storeLinks: [],
    };

    const mockLesson1: Lesson = {
        title: "Test Lesson 1",
        shortDescription: "Test Short Description 1",
        videoUrl: "https://example.com/video1",
        fullDescription: "Test Full Description 1",
        productIds: [mockId],
    };

    const mockLesson2: Lesson = {
        title: "Test Lesson 2",
        shortDescription: "Test Short Description 2",
        videoUrl: "https://example.com/video2",
        fullDescription: "Test Full Description 2",
        productIds: [mockId],
    };

    describe("createLesson", () => {
        it("should create a new lesson", async () => {
            const res = await request
                .post("/api/lessons")
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Lesson created successfully");

            const lesson = await LessonModel.findOne(mockLesson1);
            expect(lesson).not.toBeNull();
        });

        it("should return an error if lesson creation fails", async () => {
            const mockCreate = jest.spyOn(LessonModel, "create");
            mockCreate.mockRejectedValue(mockError);

            const res = await request
                .post("/api/lessons")
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1)
                .expect(500);

            expect(res.body).toHaveProperty("message");
            mockCreate.mockRestore();
        });
    });

    describe("getLessonById", () => {
        it("should get a single lesson by id with populated product images", async () => {
            const product = await ProductModel.create(mockProduct);

            const lesson = await LessonModel.create({
                ...mockLesson1,
                productIds: [product._id],
            });

            const res = await request
                .get(`/api/lessons/${lesson._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.products[0].imageUrl).toBe(mockProduct.imageUrl);
        });

        it("should return 404 if lesson not found", async () => {
            const res = await request
                .get(`/api/lessons/${mockId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Lesson not found");
        });
    });

    describe("getAllLessons", () => {
        it("should return all lessons (without fullDescription and productIds)", async () => {
            await LessonModel.insertMany([mockLesson1, mockLesson2]);

            const res = await request
                .get("/api/lessons")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].fullDescription).toBeUndefined();
            expect(res.body[0].productIds).toBeUndefined();
        });

        it("should return 404 if no lessons found", async () => {
            const res = await request
                .get("/api/lessons")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Lessons not found");
        });
    });

    describe("updateLessonById", () => {
        it("should update a lesson", async () => {
            const lesson = await LessonModel.create(mockLesson1);

            const res = await request
                .put(`/api/lessons/${lesson._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson2);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Lesson updated successfully");

            const updated = await LessonModel.findById(lesson._id);
            expect(updated?.title).toBe(mockLesson2.title);
        });

        it("should return 404 when updating a non-existent lesson", async () => {
            const res = await request
                .put(`/api/lessons/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockLesson1);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Lesson not found");
        });
    });

    describe("deleteLessonById", () => {
        it("should delete a lesson", async () => {
            const lesson = await LessonModel.create(mockLesson1);

            const res = await request
                .delete(`/api/lessons/${lesson._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Lesson deleted successfully");

            const deleted = await LessonModel.findById(lesson._id);
            expect(deleted).toBeNull();
        });

        it("should handle errors during lesson deletion", async () => {
            jest.spyOn(LessonModel, "findByIdAndDelete").mockRejectedValue(
                mockError
            );

            await request
                .delete(`/api/lessons/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(500);
        });
    });
});
