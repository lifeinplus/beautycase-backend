import { NextFunction, Request, Response } from "express";

import { BrandModel } from "../models";
import { NotFoundError } from "../utils";

export const createBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brand = new BrandModel(req.body);
        await brand.save();
        res.status(201).json({
            count: 1,
            message: "Brand created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const readBrands = async (
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

export const updateBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;

    const { id } = params;
    const { name } = body;

    try {
        const brand = await BrandModel.findById(id).exec();

        if (!brand) {
            throw new NotFoundError("Brand not found");
        }

        brand.name = name;
        await brand.save();

        res.status(200).json({ message: "Brand updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        await BrandModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        next(error);
    }
};
