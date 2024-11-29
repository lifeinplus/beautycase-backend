import { Request, Response } from "express";

import Logging from "../library/Logging";
import { ProductModel } from "../models";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find();

        products.length
            ? res.status(200).json(products)
            : res.status(404).json({ message: "Products not found" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};

export const addProduct = async (req: Request, res: Response) => {
    try {
        const product = new ProductModel(req.body);
        await product.save();
        res.status(201).json({
            message: "Product added successfully",
            count: 1,
        });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};

export const addProductsList = async (req: Request, res: Response) => {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        res.status(400).json({ message: "Invalid product list provided" });
    }

    try {
        const createdProducts = await ProductModel.insertMany(products);
        res.status(201).json({
            message: "Products added successfully",
            count: createdProducts.length,
        });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};
