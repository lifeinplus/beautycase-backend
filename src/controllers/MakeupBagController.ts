import { NextFunction, Request, Response } from "express";

import * as MakeupBagService from "../services/MakeupBagService";

export const createMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const makeupBag = await MakeupBagService.createMakeupBag(body);

        res.status(201).json({
            id: makeupBag._id,
            message: "MakeupBag created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllMakeupBags = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const makeupBags = await MakeupBagService.getAllMakeupBags();
        res.status(200).json(makeupBags);
    } catch (error) {
        next(error);
    }
};

export const getMakeupBagById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const makeupBag = await MakeupBagService.getMakeupBagById(id);
        res.status(200).json(makeupBag);
    } catch (error) {
        next(error);
    }
};

export const updateMakeupBagById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const makeupBag = await MakeupBagService.updateMakeupBagById(id, body);

        res.status(200).json({
            id: makeupBag._id,
            message: "MakeupBag updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMakeupBagById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const makeupBag = await MakeupBagService.deleteMakeupBagById(id);

        res.status(200).json({
            id: makeupBag._id,
            message: "MakeupBag deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
