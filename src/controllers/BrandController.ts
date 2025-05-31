import { NextFunction, Request, Response } from "express";

import * as BrandService from "../services/BrandService";

export const createBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brand = await BrandService.createBrand(req.body);

        res.status(201).json({
            count: 1,
            id: brand._id,
            message: "Brand created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllBrands = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brands = await BrandService.getAllBrands();
        res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
};

export const updateBrandById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const brand = await BrandService.updateBrandById(id, body);

        res.status(200).json({
            id: brand._id,
            message: "Brand updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBrandById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const brand = await BrandService.deleteBrandById(id);

        res.status(200).json({
            id: brand._id,
            message: "Brand deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
