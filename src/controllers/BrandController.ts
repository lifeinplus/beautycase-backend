import { NextFunction, Request, Response } from "express";

import { BrandModel } from "../models";
import { NotFoundError } from "../utils";

export const getBrands = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brands = await BrandModel.find().sort("name");

        if (!brands.length) {
            throw new NotFoundError("Brands not found");
        }

        res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
};

export const addBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brand = new BrandModel(req.body);
        await brand.save();
        res.status(201).json({
            message: "Brand added successfully",
            count: 1,
        });
    } catch (error) {
        next(error);
    }
};
