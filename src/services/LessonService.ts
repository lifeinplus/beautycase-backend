import LessonModel from "../models/LessonModel";
import type { Lesson } from "../models/LessonModel";
import { NotFoundError } from "../utils/AppErrors";

export const createLesson = async (data: Lesson) => {
    const lesson = await LessonModel.create(data);
    return lesson;
};

export const getLessonById = async (id: string) => {
    const lesson = await LessonModel.findById(id).populate(
        "productIds",
        "imageUrl"
    );

    if (!lesson) {
        throw new NotFoundError("Lesson not found");
    }

    return lesson;
};

export const getAllLessons = async () => {
    const lessons = await LessonModel.find().select(
        "-fullDescription -productIds"
    );

    if (!lessons.length) {
        throw new NotFoundError("Lessons not found");
    }

    return lessons;
};

export const updateLessonById = async (id: string, data: Lesson) => {
    const lesson = await LessonModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!lesson) {
        throw new NotFoundError("Lesson not found");
    }

    return lesson;
};

export const deleteLessonById = async (id: string) => {
    const lesson = await LessonModel.findByIdAndDelete(id);

    if (!lesson) {
        throw new NotFoundError("Lesson not found");
    }

    return lesson;
};
