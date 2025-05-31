import { NextFunction, Request, Response } from "express";

import * as CategoryService from "../services/CategoryService";

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await CategoryService.createCategory(req.body);

        res.status(201).json({
            count: 1,
            id: category.id,
            message: "Category created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};
