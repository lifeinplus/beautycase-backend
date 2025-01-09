import { NextFunction, Request, Response } from "express";

import { MakeupBagModel } from "../models";
import { NotFoundError } from "../utils";

export const addMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { clientId, selectedStageIds, selectedToolIds } = req.body;

    try {
        const makeupBag = new MakeupBagModel({
            clientId,
            stageIds: selectedStageIds,
            toolIds: selectedToolIds,
        });

        const response = await makeupBag.save();

        res.status(201).json({
            count: 1,
            id: response._id,
            message: "MakeupBag added successfully",
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
        await MakeupBagModel.findByIdAndDelete(id);
        res.status(200).json({ message: "MakeupBag successfully deleted" });
    } catch (error) {
        next(error);
    }
};

export const editMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { clientId, selectedStageIds, selectedToolIds } = req.body;

    try {
        const makeupBag = await MakeupBagModel.findById(id).exec();

        if (!makeupBag) {
            throw new NotFoundError("MakeupBag not found");
        }

        makeupBag.clientId = clientId;
        makeupBag.stageIds = selectedStageIds;
        makeupBag.toolIds = selectedToolIds;

        await makeupBag.save();

        res.status(200).json({ message: "MakeupBag successfully changed" });
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
        const makeupBag = await MakeupBagModel.findById(id).populate([
            {
                path: "stageIds",
                populate: { path: "productIds" },
            },
            {
                path: "toolIds",
                populate: { path: "brandId" },
            },
        ]);

        if (!makeupBag) {
            throw new NotFoundError("MakeupBag not found");
        }

        res.status(200).json(makeupBag);
    } catch (error) {
        next(error);
    }
};

export const getMakeupBags = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const makeupBags = await MakeupBagModel.find().populate({
            path: "clientId",
            select: "username",
        });

        if (!makeupBags) {
            throw new NotFoundError("MakeupBags not found");
        }

        res.status(200).json(makeupBags);
    } catch (error) {
        next(error);
    }
};
