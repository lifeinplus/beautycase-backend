import { NextFunction, Request, Response } from "express";

import { StoreModel } from "../models";
import { NotFoundError } from "../utils";

export const createStore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const store = new StoreModel(req.body);
        await store.save();
        res.status(201).json({
            count: 1,
            message: "Store created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const readStores = async (
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

export const updateStore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // TODO: Implement updateStore
        res.status(200).json("stores");
    } catch (error) {
        next(error);
    }
};

export const deleteStore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // TODO: Implement deleteStore
        res.status(200).json("stores");
    } catch (error) {
        next(error);
    }
};
