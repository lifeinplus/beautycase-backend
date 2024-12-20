import { NextFunction, Request, Response } from "express";

import { LessonModel } from "../models";
import { BadRequestError, NotFoundError } from "../utils";

export const addLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        title,
        shortDescription,
        videoUrl,
        fullDescription,
        selectedProductIds,
    } = req.body;

    try {
        const lesson = new LessonModel({
            title: title,
            shortDescription: shortDescription,
            videoUrl: videoUrl,
            fullDescription: fullDescription,
            productIds: selectedProductIds,
        });

        const response = await lesson.save();

        res.status(201).json({
            count: 1,
            id: response._id,
            message: "Lesson added successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const addLessonsList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const lessons = req.body;

    if (!Array.isArray(lessons) || lessons.length === 0) {
        throw new BadRequestError("Invalid lesson list provided");
    }

    try {
        const createdLessons = await LessonModel.insertMany(lessons);
        res.status(201).json({
            message: "Lessons added successfully",
            count: createdLessons.length,
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
        await LessonModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Lesson successfully deleted" });
    } catch (error) {
        next(error);
    }
};

export const editLesson = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const {
        title,
        shortDescription,
        videoUrl,
        fullDescription,
        selectedProductIds,
    } = req.body;

    try {
        const lesson = await LessonModel.findById(id).exec();

        if (!lesson) {
            throw new NotFoundError("Lesson not found");
        }

        lesson.title = title;
        lesson.shortDescription = shortDescription;
        lesson.videoUrl = videoUrl;
        lesson.fullDescription = fullDescription;
        lesson.productIds = selectedProductIds;

        await lesson.save();

        res.status(200).json({ message: "Lesson successfully changed" });
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
        const lesson = await LessonModel.findById(id).populate("productIds");

        if (!lesson) {
            throw new NotFoundError("Lesson not found");
        }

        res.status(200).json(lesson);
    } catch (error) {
        next(error);
    }
};

export const getLessons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const lessons = await LessonModel.find();

        if (!lessons.length) {
            throw new NotFoundError("Lessons not found");
        }

        res.status(200).json(lessons);
    } catch (error) {
        next(error);
    }
};
