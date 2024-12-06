import { NextFunction, Request, Response } from "express";

import { ProductModel } from "../models";
import { BadRequestError, NotFoundError } from "../utils";

export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await ProductModel.find();

        if (!products.length) {
            throw new NotFoundError("Products not found");
        }

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const product = await ProductModel.findById(id);

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = new ProductModel(req.body);
        await product.save();
        res.status(201).json({
            message: "Product added successfully",
            count: 1,
        });
    } catch (error) {
        next(error);
    }
};

export const addProductsList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        throw new BadRequestError("Invalid product list provided");
    }

    try {
        const createdProducts = await ProductModel.insertMany(products);
        res.status(201).json({
            message: "Products added successfully",
            count: createdProducts.length,
        });
    } catch (error) {
        next(error);
    }
};
