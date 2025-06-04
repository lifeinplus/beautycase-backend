import type { Lesson } from "../../models/LessonModel";
import type { Product } from "../../models/ProductModel";

export const mockBrandId = "683cbe0796c7f5d3d62101e0";
export const mockLessonId = "682a378b09c4df2756fcece5";

export const mockProduct: Product = {
    brandId: mockBrandId,
    name: "Lipstick",
    imageUrl: "https://image.url/lipstick.png",
    comment: "Great product",
    storeLinks: [],
};

export const mockLesson1: Lesson = {
    title: "Test Lesson 1",
    shortDescription: "Test Short Description 1",
    videoUrl: "https://example.com/video1",
    fullDescription: "Test Full Description 1",
    productIds: [mockLessonId],
};

export const mockLesson2: Lesson = {
    title: "Test Lesson 2",
    shortDescription: "Test Short Description 2",
    videoUrl: "https://example.com/video2",
    fullDescription: "Test Full Description 2",
    productIds: [mockLessonId],
};
