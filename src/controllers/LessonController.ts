import { NextFunction, Request, Response } from "express";

import * as LessonService from "../services/LessonService";

export const createLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const lesson = await LessonService.createLesson(body);

        res.status(201).json({
            id: lesson._id,
            message: "Lesson created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllLessons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const lessons = await LessonService.getAllLessons();
        res.status(200).json(lessons);
    } catch (error) {
        next(error);
    }
};

export const getLessonById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const lesson = await LessonService.getLessonById(id);
        res.status(200).json(lesson);
    } catch (error) {
        next(error);
    }
};

export const updateLessonById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const lesson = await LessonService.updateLessonById(id, body);

        res.status(200).json({
            id: lesson._id,
            message: "Lesson updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const updateLessonProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const lesson = await LessonService.updateLessonProducts(id, body);

        res.status(200).json({
            id: lesson._id,
            message: "Lesson products updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteLessonById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const lesson = await LessonService.deleteLessonById(id);

        res.status(200).json({
            id: lesson._id,
            message: "Lesson deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
