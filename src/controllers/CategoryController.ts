import { NextFunction, Request, Response } from "express";

import { CategoryModel } from "../models";
import { NotFoundError } from "../utils";

export const addCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = new CategoryModel(req.body);
        await category.save();
        res.status(201).json({
            message: "Category added successfully",
            count: 1,
        });
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (
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
