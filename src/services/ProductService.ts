import { v2 as cloudinary } from "cloudinary";

import ProductModel from "../models/ProductModel";
import type { Product } from "../models/ProductModel";
import { NotFoundError } from "../utils/AppErrors";
import tempUploadsService from "./tempUploadsService";

export const createProduct = async (data: Product) => {
    const product = await ProductModel.create(data);
    const publicId = tempUploadsService.get(data.imageUrl);

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
        tempUploadsService.remove(data.imageUrl);
    }

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

    const publicId = tempUploadsService.get(imageUrl);

    if (publicId) {
        const renamed = await cloudinary.uploader.rename(
            publicId,
            `products/${product._id}`,
            { invalidate: true, overwrite: true }
        );

        const moved = await cloudinary.uploader.explicit(renamed.public_id, {
            asset_folder: "products",
            display_name: product._id,
            invalidate: true,
            type: "upload",
        });

        product.imageId = moved.public_id;
        product.imageUrl = moved.secure_url;
        tempUploadsService.remove(imageUrl);
    }

    if (product.imageId && !imageUrl.includes("cloudinary")) {
        await cloudinary.uploader.destroy(product.imageId);
        product.imageId = undefined;
    }

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
