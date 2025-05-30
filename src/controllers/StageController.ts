import { NextFunction, Request, Response } from "express";

import * as StageService from "../services/StageService";

export const createStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const stage = await StageService.createStage(body);

        res.status(201).json({
            count: 1,
            id: stage._id,
            message: "Stage created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const duplicateStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { params } = req;
    const { id } = params;

    try {
        const stage = await StageService.duplicateStage(id);

        res.status(201).json({
            count: 1,
            id: stage._id,
            message: "Stage duplicated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const readStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const stage = await StageService.readStage(id);
        res.status(200).json(stage);
    } catch (error) {
        next(error);
    }
};

export const readStages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stages = await StageService.readStages();
        res.status(200).json(stages);
    } catch (error) {
        next(error);
    }
};

export const updateStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const stage = await StageService.updateStage(id, body);

        res.status(200).json({
            id: stage._id,
            message: "Stage updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const stage = await StageService.deleteStage(id);

        res.status(200).json({
            id: stage._id,
            message: "Stage deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
