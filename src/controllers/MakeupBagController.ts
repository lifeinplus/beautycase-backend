import { NextFunction, Request, Response } from "express";

import { BrandModel, StageModel } from "../models";
import { NotFoundError } from "../utils";

export const getMakeupBag = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brands = await BrandModel.find().populate("toolIds");
        const stages = await StageModel.find().populate("productIds");

        if (!brands.length) {
            throw new NotFoundError("Brands not found");
        }

        if (!stages.length) {
            throw new NotFoundError("Stages not found");
        }

        res.status(200).json({ brands, stages });
    } catch (error) {
        next(error);
    }
};
