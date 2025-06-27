import type { Lesson } from "../../models/LessonModel";

export const mockLessonId = "683cbe0796c7f5d3d62101e0";
export const mockLessonUserId = "682a378b09c4df2756fcece5";

export const mockLesson1: Lesson = {
    title: "Test Lesson 1",
    shortDescription: "Test Short Description 1",
    videoUrl: "https://example.com/video1",
    fullDescription: "Test Full Description 1",
    productIds: ["683cbe0796c7f5d3d62101e1"],
    clientIds: [mockLessonUserId],
};

export const mockLesson2: Lesson = {
    title: "Test Lesson 2",
    shortDescription: "Test Short Description 2",
    videoUrl: "https://example.com/video2",
    fullDescription: "Test Full Description 2",
    productIds: ["683cbe0796c7f5d3d62101e2"],
    clientIds: [mockLessonUserId],
};

export const mockLessons: Lesson[] = [mockLesson1, mockLesson2];
