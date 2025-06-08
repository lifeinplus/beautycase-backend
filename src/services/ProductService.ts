import { v2 as cloudinary } from "cloudinary";

import Logging from "../library/Logging";
import ProductModel from "../models/ProductModel";
import type { Product, ProductDocument } from "../models/ProductModel";
import { CloudinaryUploadResponse } from "../types/upload";
import { NotFoundError } from "../utils/AppErrors";
import tempUploadsService from "./tempUploadsService";

const handleImageUpdate = async (
    product: ProductDocument,
    imageUrl: string
) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (publicId) {
        try {
            const renamed: CloudinaryUploadResponse =
                await cloudinary.uploader.rename(
                    publicId,
                    `products/${product._id}`,
                    { invalidate: true, overwrite: true }
                );

            const moved: CloudinaryUploadResponse =
                await cloudinary.uploader.explicit(renamed.public_id, {
                    asset_folder: "products",
                    display_name: product._id,
                    invalidate: true,
                    type: "upload",
                });

            product.imageId = moved.public_id;
            product.imageUrl = moved.secure_url;

            tempUploadsService.remove(imageUrl);
        } catch (error) {
            Logging.error("Error handling image update:");
            Logging.error(error);
            throw error;
        }
    }

    if (product.imageId && !imageUrl.includes("cloudinary")) {
        await cloudinary.uploader.destroy(product.imageId);
        product.imageId = undefined;
    }
};

const handleImageUpload = async (
    product: ProductDocument,
    imageUrl: string
) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.explicit(publicId, {
            asset_folder: "products",
            display_name: product._id,
            invalidate: true,
            type: "upload",
        });

        const renamed: CloudinaryUploadResponse =
            await cloudinary.uploader.rename(
                publicId,
                `products/${product._id}`,
                { invalidate: true }
            );

        product.imageId = renamed?.public_id;
        product.imageUrl = renamed?.secure_url;

        tempUploadsService.remove(imageUrl);
    } catch (error) {
        Logging.error("Error handling image upload:");
        Logging.error(error);
        throw error;
    }
};

export const createProduct = async (data: Product) => {
    const product = new ProductModel(data);
    const { imageUrl } = data;

    await handleImageUpload(product, imageUrl);
    await product.save();

    return product;
};

export const getAllProducts = async () => {
    const products = await ProductModel.find().select("imageUrl");

    if (!products.length) {
        throw new NotFoundError("Products not found");
    }

    return products;
};

export const getProductById = async (id: string) => {
    const product = await ProductModel.findById(id).populate("brandId");

    if (!product) {
        throw new NotFoundError("Product not found");
    }

    return product;
};

export const updateProductById = async (id: string, data: Product) => {
    const { imageUrl } = data;

    const product = await ProductModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new NotFoundError("Product not found");
    }

    await handleImageUpdate(product, imageUrl);
    await product.save();

    return product;
};

export const deleteProductById = async (id: string) => {
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
        throw new NotFoundError("Product not found");
    }

    if (product.imageId) {
        await cloudinary.uploader.destroy(product.imageId);
    }

    return product;
};
