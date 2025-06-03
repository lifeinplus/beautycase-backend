import LessonModel from "../../models/LessonModel";
import {
    mockLessonId,
    mockLesson1,
    mockLesson2,
    mockProduct,
} from "../../tests/mocks/lesson";
import { NotFoundError } from "../../utils/AppErrors";
import * as LessonService from "../LessonService";
import * as ProductService from "../ProductService";

describe("LessonService", () => {
    describe("createLesson", () => {
        it("should create a lesson", async () => {
            const lesson = await LessonService.createLesson(mockLesson1);
            expect(lesson).toHaveProperty("_id");
            expect(lesson.title).toBe(mockLesson1.title);
        });
    });

    describe("getAllLessons", () => {
        it("should get all lessons", async () => {
            await LessonService.createLesson(mockLesson1);
            await LessonService.createLesson(mockLesson2);

            const lessons = await LessonService.getAllLessons();

            expect(lessons.length).toBe(2);
            expect(lessons[0].title).toBe(mockLesson1.title);
            expect(lessons[1].title).toBe(mockLesson2.title);
        });

        it("should throw NotFoundError if no lessons found", async () => {
            const lessonPromise = LessonService.getAllLessons();
            await expect(lessonPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("getLessonById", () => {
        it("should get a lesson with populated productIds", async () => {
            const product = await ProductService.createProduct(mockProduct);

            const lesson = await LessonService.createLesson({
                ...mockLesson1,
                productIds: [String(product._id)],
            });

            const result = await LessonService.getLessonById(
                String(lesson._id)
            );

            expect(result._id).toEqual(lesson._id);
        });

        it("should throw NotFoundError if lesson not found by id", async () => {
            const lessonPromise = LessonService.getLessonById(mockLessonId);
            await expect(lessonPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateLessonById", () => {
        it("should update a lesson", async () => {
            const lesson = await LessonModel.create(mockLesson1);

            const updated = await LessonService.updateLessonById(
                String(lesson._id),
                mockLesson2
            );

            expect(updated.title).toBe(mockLesson2.title);
        });

        it("should throw NotFoundError if lesson to update not found ", async () => {
            const lessonPromise = LessonService.updateLessonById(
                mockLessonId,
                mockLesson2
            );
            await expect(lessonPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteLessonById", () => {
        it("should delete a lesson", async () => {
            const lesson = await LessonModel.create(mockLesson1);

            const deleted = await LessonService.deleteLessonById(
                String(lesson._id)
            );
            expect(deleted.title).toBe(mockLesson1.title);

            const found = await LessonModel.findById(lesson._id);
            expect(found).toBeNull();
        });

        it("should throw NotFoundError if lesson to delete not found", async () => {
            const lessonPromise = LessonService.deleteLessonById(mockLessonId);
            await expect(lessonPromise).rejects.toThrow(NotFoundError);
        });
    });
});
