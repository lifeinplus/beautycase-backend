import { NextFunction, Request, Response } from "express";

import { StoreModel } from "../models";
import { NotFoundError } from "../utils";

export const getStores = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stores = await StoreModel.find().sort("name");

        if (!stores.length) {
            throw new NotFoundError("Stores not found");
        }

        res.status(200).json(stores);
    } catch (error) {
        next(error);
    }
};

export const addStore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const store = new StoreModel(req.body);
        await store.save();
        res.status(201).json({
            message: "Store added successfully",
            count: 1,
        });
    } catch (error) {
        next(error);
    }
};
