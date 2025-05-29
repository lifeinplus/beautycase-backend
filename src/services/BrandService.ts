import BrandModel from "../models/BrandModel";
import type { Brand } from "../models/BrandModel";
import { NotFoundError } from "../utils/AppErrors";

export const createBrand = async (data: { name: string }) => {
    return await BrandModel.create(data);
};

export const readBrands = async () => {
    const brands = await BrandModel.find().sort("name");

    if (!brands.length) {
        throw new NotFoundError("Brands not found");
    }

    return brands;
};

export const updateBrand = async (id: string, data: Brand) => {
    const brand = await BrandModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!brand) {
        throw new NotFoundError("Brand not found");
    }

    return brand;
};

export const deleteBrand = async (id: string) => {
    const brand = await BrandModel.findByIdAndDelete(id);

    if (!brand) {
        throw new NotFoundError("Brand not found");
    }

    return brand;
};
