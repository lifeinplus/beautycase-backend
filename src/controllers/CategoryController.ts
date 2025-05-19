import { NextFunction, Request, Response } from "express";

import CategoryModel from "../models/CategoryModel";
import { NotFoundError } from "../utils/AppErrors";

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await CategoryModel.create(req.body);

        res.status(201).json({
            message: "Category created successfully",
            count: 1,
        });
    } catch (error) {
        next(error);
    }
};

export const readCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await CategoryModel.find();

        if (!categories.length) {
            throw new NotFoundError("Categories not found");
        }

        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};
