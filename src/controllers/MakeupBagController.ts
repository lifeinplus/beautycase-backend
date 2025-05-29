import { NextFunction, Request, Response } from "express";

import * as MakeupBagService from "../services/MakeupBagService";

export const createMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { categoryId, clientId, stageIds, toolIds } = req.body;

    try {
        const makeupBag = await MakeupBagService.createMakeupBag({
            categoryId,
            clientId,
            stageIds,
            toolIds,
        });

        res.status(201).json({
            count: 1,
            id: makeupBag._id,
            message: "MakeupBag created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const readMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const makeupBag = await MakeupBagService.readMakeupBag(id);
        res.status(200).json(makeupBag);
    } catch (error) {
        next(error);
    }
};

export const readMakeupBags = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const makeupBags = await MakeupBagService.readMakeupBags();
        res.status(200).json(makeupBags);
    } catch (error) {
        next(error);
    }
};

export const updateMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { categoryId, clientId, stageIds, toolIds } = req.body;

    try {
        const makeupBag = await MakeupBagService.updateMakeupBag(id, {
            categoryId,
            clientId,
            stageIds,
            toolIds,
        });

        res.status(200).json({
            id: makeupBag._id,
            message: "MakeupBag updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const makeupBag = await MakeupBagService.deleteMakeupBag(id);

        res.status(200).json({
            id: makeupBag._id,
            message: "MakeupBag deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
