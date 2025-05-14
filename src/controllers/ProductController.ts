import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";

import ProductModel from "../models/ProductModel";
import tempUploadsService from "../services/tempUploadsService";
import { NotFoundError } from "../utils/AppErrors";

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const product = new ProductModel(body);
        const publicId = tempUploadsService.get(body.imageUrl);

        if (publicId) {
            await cloudinary.uploader.explicit(publicId, {
                asset_folder: "products",
                display_name: product._id,
                invalidate: true,
                type: "upload",
            });

            const response = await cloudinary.uploader.rename(
                publicId,
                `products/${product._id}`,
                { invalidate: true }
            );

            product.imageId = response.public_id;
            product.imageUrl = response.secure_url;
            tempUploadsService.remove(body.imageUrl);
        }

        await product.save();

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
        const product = await ProductModel.findById(id).populate("brandId");

        if (!product) {
            throw new NotFoundError("Product not found");
        }

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
        const products = await ProductModel.find().select("imageUrl");

        if (!products.length) {
            throw new NotFoundError("Products not found");
        }

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
    const { body, params } = req;

    const { id } = params;
    const { name, brandId, imageUrl, shade, comment, storeLinks } = body;

    try {
        const product = await ProductModel.findById(id).exec();

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        product.brandId = brandId;
        product.name = name;
        product.imageUrl = imageUrl;
        product.shade = shade;
        product.comment = comment;
        product.storeLinks = storeLinks;

        const publicId = tempUploadsService.get(imageUrl);

        if (publicId) {
            const renamed = await cloudinary.uploader.rename(
                publicId,
                `products/${product._id}`,
                { invalidate: true, overwrite: true }
            );

            const moved = await cloudinary.uploader.explicit(
                renamed.public_id,
                {
                    asset_folder: "products",
                    display_name: product._id,
                    invalidate: true,
                    type: "upload",
                }
            );

            product.imageId = moved.public_id;
            product.imageUrl = moved.secure_url;
            tempUploadsService.remove(imageUrl);
        }

        if (product.imageId && !imageUrl.includes("cloudinary")) {
            await cloudinary.uploader.destroy(product.imageId);
            product.imageId = undefined;
        }

        await product.save();

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
        const product = await ProductModel.findById(id).exec();

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        if (product.imageId) {
            await cloudinary.uploader.destroy(product.imageId);
        }

        await ProductModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
};
