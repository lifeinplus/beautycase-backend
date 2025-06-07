import { v2 as cloudinary } from "cloudinary";

import ProductModel from "../models/ProductModel";
import type { Product } from "../models/ProductModel";
import { NotFoundError } from "../utils/AppErrors";
import { handleImageUpdate, handleImageUpload } from "./cloudinaryImageService";

export const createProduct = async (data: Product) => {
    const product = new ProductModel(data);
    const { imageUrl } = data;

    await handleImageUpload(product, imageUrl, "products");
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

    await handleImageUpdate(product, imageUrl, "products");
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
