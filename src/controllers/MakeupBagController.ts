import { NextFunction, Request, Response } from "express";

import { BrandModel, MakeupBagModel, StageModel } from "../models";
import { NotFoundError } from "../utils";

export const addMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const makeupBag = new MakeupBagModel(req.body);

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

export const getMakeupBagById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const makeupBag = await MakeupBagModel.findById(id).populate(
            "brandIds",
            "stageIds"
        );

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
