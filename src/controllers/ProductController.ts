import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import { NextFunction, Request, Response } from "express";

import { ProductModel } from "../models";
import { BadRequestError, NotFoundError } from "../utils";

const tempImages = new Map();

export const addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const product = new ProductModel(body);

        if (tempImages.has(body.imageUrl)) {
            const publicId = tempImages.get(body.imageUrl);

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
            tempImages.delete(body.imageUrl);
        }

        await product.save();

        res.status(201).json({
            count: 1,
            id: product._id,
            message: "Product added successfully",
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
        const product = await ProductModel.findById(id).exec();

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        if (product.imageId) {
            const response = await cloudinary.uploader.destroy(product.imageId);
        }

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

        if (tempImages.has(imageUrl)) {
            const oldPublicId = tempImages.get(imageUrl);

            const renamed = await cloudinary.uploader.rename(
                oldPublicId,
                `products/${product._id}`,
                {
                    invalidate: true,
                    overwrite: true,
                }
            );

            const explicited = await cloudinary.uploader.explicit(
                renamed.public_id,
                {
                    asset_folder: "products",
                    display_name: product._id,
                    invalidate: true,
                    type: "upload",
                }
            );

            product.imageId = explicited.public_id;
            product.imageUrl = explicited.secure_url;
            tempImages.delete(imageUrl);
        }

        if (product.imageId && !imageUrl.includes("cloudinary")) {
            await cloudinary.uploader.destroy(product.imageId);
            product.imageId = undefined;
        }

        await product.save();

        res.status(200).json({
            id: product._id,
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
        const products = await ProductModel.find().select("imageUrl");

        if (!products.length) {
            throw new NotFoundError("Products not found");
        }

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const uploadImageTemp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { file } = req;

    try {
        if (!file) {
            throw new BadRequestError("File upload failed");
        }

        const fileStr = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${fileStr}`;

        const options: UploadApiOptions = {
            folder: "products/temp",
            overwrite: true,
            resource_type: "auto",
            unique_filename: true,
            use_filename: false,
        };

        const uploadResult = await cloudinary.uploader.upload(dataUri, options);

        tempImages.set(uploadResult.secure_url, uploadResult.public_id);

        res.status(200).json({
            imageUrl: uploadResult.secure_url,
        });
    } catch (error) {
        next(error);
    }
};
