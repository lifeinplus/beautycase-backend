import { NextFunction, Request, Response } from "express";

import StoreModel from "../models/StoreModel";
import { NotFoundError } from "../utils/AppErrors";

export const createStore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await StoreModel.create(req.body);

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
    const { body, params } = req;

    const { id } = params;
    const { name } = body;

    try {
        const store = await StoreModel.findById(id).exec();

        if (!store) {
            throw new NotFoundError("Store not found");
        }

        store.name = name;
        await store.save();

        res.status(200).json({ message: "Store updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteStore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        await StoreModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
        next(error);
    }
};
