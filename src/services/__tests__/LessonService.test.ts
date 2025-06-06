import {
    mockLessonId,
    mockLesson1,
    mockLesson2,
} from "../../tests/mocks/lesson";
import { mockProduct1 } from "../../tests/mocks/product";
import { NotFoundError } from "../../utils/AppErrors";
import * as LessonService from "../LessonService";
import * as ProductService from "../ProductService";

describe("LessonService", () => {
    describe("createLesson", () => {
        it("should create a lesson", async () => {
            const result = await LessonService.createLesson(mockLesson1);
            expect(result).toHaveProperty("_id");
            expect(result.title).toBe(mockLesson1.title);
        });
    });

    describe("getAllLessons", () => {
        it("should get all lessons", async () => {
            await LessonService.createLesson(mockLesson1);
            await LessonService.createLesson(mockLesson2);

            const result = await LessonService.getAllLessons();

            expect(result.length).toBe(2);
            expect(result[0].title).toBe(mockLesson1.title);
            expect(result[1].title).toBe(mockLesson2.title);
        });

        it("should throw NotFoundError if no lessons found", async () => {
            const result = LessonService.getAllLessons();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getLessonById", () => {
        it("should get a lesson with populated productIds", async () => {
            const product = await ProductService.createProduct(mockProduct1);

            const lesson = await LessonService.createLesson({
                ...mockLesson1,
                productIds: [String(product._id)],
            });

            const result = await LessonService.getLessonById(
                String(lesson._id)
            );

            expect(result._id).toEqual(lesson._id);
        });

        it("should throw NotFoundError if lesson not found", async () => {
            const result = LessonService.getLessonById(mockLessonId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateLessonById", () => {
        it("should update a lesson", async () => {
            const lesson = await LessonService.createLesson(mockLesson1);

            const result = await LessonService.updateLessonById(
                String(lesson._id),
                mockLesson2
            );

            expect(result.title).toBe(mockLesson2.title);
        });

        it("should throw NotFoundError if lesson to update not found ", async () => {
            const result = LessonService.updateLessonById(
                mockLessonId,
                mockLesson2
            );
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteLessonById", () => {
        it("should delete a lesson", async () => {
            const lesson = await LessonService.createLesson(mockLesson1);

            const result = await LessonService.deleteLessonById(
                String(lesson._id)
            );

            expect(result.title).toBe(mockLesson1.title);
        });

        it("should throw NotFoundError if lesson to delete not found", async () => {
            const result = LessonService.deleteLessonById(mockLessonId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
