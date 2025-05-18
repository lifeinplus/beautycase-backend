import { NextFunction, Request, Response } from "express";

import LessonModel from "../models/LessonModel";
import { NotFoundError } from "../utils/AppErrors";

export const createLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, shortDescription, videoUrl, fullDescription, productIds } =
        req.body;

    try {
        const lesson = new LessonModel({
            title,
            shortDescription,
            videoUrl,
            fullDescription,
            productIds,
        });

        const response = await lesson.save();

        res.status(201).json({
            count: 1,
            id: response._id,
            message: "Lesson created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const readLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const lesson = await LessonModel.findById(id).populate(
            "productIds",
            "imageUrl"
        );

        if (!lesson) {
            throw new NotFoundError("Lesson not found");
        }

        res.status(200).json(lesson);
    } catch (error) {
        next(error);
    }
};

export const readLessons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const lessons = await LessonModel.find().select(
            "-fullDescription -productIds"
        );

        if (!lessons.length) {
            throw new NotFoundError("Lessons not found");
        }

        res.status(200).json(lessons);
    } catch (error) {
        next(error);
    }
};

export const updateLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { title, shortDescription, videoUrl, fullDescription, productIds } =
        req.body;

    try {
        const lesson = await LessonModel.findById(id).exec();

        if (!lesson) {
            throw new NotFoundError("Lesson not found");
        }

        lesson.title = title;
        lesson.shortDescription = shortDescription;
        lesson.videoUrl = videoUrl;
        lesson.fullDescription = fullDescription;
        lesson.productIds = productIds;

        await lesson.save();

        res.status(200).json({ message: "Lesson updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        await LessonModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error) {
        next(error);
    }
};
