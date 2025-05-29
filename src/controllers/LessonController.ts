import { NextFunction, Request, Response } from "express";

import * as LessonService from "../services/LessonService";

export const createLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, shortDescription, videoUrl, fullDescription, productIds } =
        req.body;

    try {
        const lesson = await LessonService.createLesson({
            title,
            shortDescription,
            videoUrl,
            fullDescription,
            productIds,
        });

        res.status(201).json({
            count: 1,
            id: lesson._id,
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
        const lesson = await LessonService.readLesson(id);
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
        const lessons = await LessonService.readLessons();
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
        const lesson = await LessonService.updateLesson(id, {
            title,
            shortDescription,
            videoUrl,
            fullDescription,
            productIds,
        });

        res.status(200).json({
            id: lesson._id,
            message: "Lesson updated successfully",
        });
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
        const lesson = await LessonService.deleteLesson(id);

        res.status(200).json({
            id: lesson._id,
            message: "Lesson deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
