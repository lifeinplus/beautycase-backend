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
            id: stage._id,
            message: "Stage created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const duplicateStageById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { params } = req;
    const { id } = params;

    try {
        const stage = await StageService.duplicateStageById(id);

        res.status(201).json({
            id: stage._id,
            message: "Stage duplicated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllStages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stages = await StageService.getAllStages();
        res.status(200).json(stages);
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
        const stage = await StageService.getStageById(id);
        res.status(200).json(stage);
    } catch (error) {
        next(error);
    }
};

export const updateStageById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const stage = await StageService.updateStageById(id, body);

        res.status(200).json({
            id: stage._id,
            message: "Stage updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const updateStageProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const stage = await StageService.updateStageProducts(id, body);

        res.status(200).json({
            id: stage._id,
            message: "Stage products updated successfully",
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
        const stage = await StageService.deleteStageById(id);

        res.status(200).json({
            id: stage._id,
            message: "Stage deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
