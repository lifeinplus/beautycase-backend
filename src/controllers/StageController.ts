import { NextFunction, Request, Response } from "express";

import { StageModel } from "../models";
import { BadRequestError, NotFoundError } from "../utils";

export const addStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stage = new StageModel(req.body);
        await stage.save();
        res.status(201).json({
            message: "Stage added successfully",
            count: 1,
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

export const getStages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stages = await StageModel.find().populate("productIds");

        if (!stages.length) {
            throw new NotFoundError("Stages not found");
        }

        res.status(200).json(stages);
    } catch (error) {
        next(error);
    }
};
