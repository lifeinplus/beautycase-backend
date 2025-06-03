import { NextFunction, Request, Response } from "express";

import * as CategoryService from "../services/CategoryService";

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const category = await CategoryService.createCategory(body);

        res.status(201).json({
            id: category._id,
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
