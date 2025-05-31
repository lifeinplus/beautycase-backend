import { NextFunction, Request, Response } from "express";

import * as ProductService from "../services/ProductService";

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const product = await ProductService.createProduct(body);

        res.status(201).json({
            count: 1,
            id: product._id,
            message: "Product created successfully",
        });
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
        const product = await ProductService.getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const updateProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const product = await ProductService.updateProductById(id, body);

        res.status(200).json({
            id: product._id,
            message: "Product updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const product = await ProductService.deleteProductById(id);

        res.status(200).json({
            id: product._id,
            message: "Product deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
