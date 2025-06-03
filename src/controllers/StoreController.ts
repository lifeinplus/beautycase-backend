import { NextFunction, Request, Response } from "express";

import * as StoreService from "../services/StoreService";

export const createStore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const store = await StoreService.createStore(body);

        res.status(201).json({
            id: store._id,
            message: "Store created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllStores = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stores = await StoreService.getAllStores();
        res.status(200).json(stores);
    } catch (error) {
        next(error);
    }
};

export const updateStoreById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const store = await StoreService.updateStoreById(id, body);

        res.status(200).json({
            id: store._id,
            message: "Store updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStoreById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const store = await StoreService.deleteStoreById(id);

        res.status(200).json({
            id: store._id,
            message: "Store deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
