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

export const readProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const product = await ProductService.readProduct(id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const readProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await ProductService.readProducts();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { name, brandId, imageUrl, shade, comment, storeLinks } = req.body;

    try {
        const product = await ProductService.updateProduct(id, {
            name,
            brandId,
            imageUrl,
            shade,
            comment,
            storeLinks,
        });

        res.status(200).json({
            id: product._id,
            message: "Product updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const product = await ProductService.deleteProduct(id);

        res.status(200).json({
            id: product._id,
            message: "Product deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
