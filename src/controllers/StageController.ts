import { NextFunction, Request, Response } from "express";

import { StageModel } from "../models";
import { BadRequestError, NotFoundError } from "../utils";

export const addStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, subtitle, imageUrl, steps, productIds } = req.body;

    try {
        const stage = new StageModel({
            title,
            subtitle,
            imageUrl,
            steps,
            productIds,
        });

        const response = await stage.save();

        res.status(201).json({
            count: 1,
            id: response._id,
            message: "Stage added successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const addStagesList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const stages = req.body;

    if (!Array.isArray(stages) || stages.length === 0) {
        throw new BadRequestError("Invalid stage list provided");
    }

    try {
        const createdStages = await StageModel.insertMany(stages);
        res.status(201).json({
            message: "Stages added successfully",
            count: createdStages.length,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStageById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        await StageModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Stage successfully deleted" });
    } catch (error) {
        next(error);
    }
};

export const editStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { title, subtitle, imageUrl, steps, productIds } = req.body;

    try {
        const stage = await StageModel.findById(id).exec();

        if (!stage) {
            throw new NotFoundError("Stage not found");
        }

        stage.title = title;
        stage.subtitle = subtitle;
        stage.imageUrl = imageUrl;
        stage.steps = steps;
        stage.productIds = productIds;

        await stage.save();

        res.status(200).json({ message: "Stage successfully changed" });
    } catch (error) {
        next(error);
    }
};

export const getStageById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const stage = await StageModel.findById(id).populate(
            "productIds",
            "imageUrl"
        );

        if (!stage) {
            throw new NotFoundError("Stage not found");
        }

        res.status(200).json(stage);
    } catch (error) {
        next(error);
    }
};

export const getStages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stages = await StageModel.find().select(
            "createdAt imageUrl subtitle title"
        );

        if (!stages.length) {
            throw new NotFoundError("Stages not found");
        }

        res.status(200).json(stages);
    } catch (error) {
        next(error);
    }
};
