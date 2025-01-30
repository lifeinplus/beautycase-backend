import { NextFunction, Request, Response } from "express";

import { ProductModel } from "../models";
import { BadRequestError, NotFoundError } from "../utils";

export const addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = new ProductModel(req.body);
        const response = await product.save();
        res.status(201).json({
            count: 1,
            id: response._id,
            message: "Product added successfully",
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

export const deleteProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        await ProductModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Product successfully deleted" });
    } catch (error) {
        next(error);
    }
};

export const editProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { name, brandId, image, shade, comment, storeLinks } = req.body;

    try {
        const product = await ProductModel.findById(id).exec();

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        product.name = name;
        product.brandId = brandId;
        product.image = image;
        product.shade = shade;
        product.comment = comment;
        product.storeLinks = storeLinks;

        const response = await product.save();

        res.status(200).json({
            id: response._id,
            message: "Product successfully changed",
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
        const product = await ProductModel.findById(id).populate("brandId");

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await ProductModel.find().select("image");

        if (!products.length) {
            throw new NotFoundError("Products not found");
        }

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};
