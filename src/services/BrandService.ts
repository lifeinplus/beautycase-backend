import BrandModel from "../models/BrandModel";
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

export const updateBrand = async (id: string, name: string) => {
    const brand = await BrandModel.findById(id).exec();

    if (!brand) {
        throw new NotFoundError("Brand not found");
    }

    brand.name = name;
    await brand.save();
};

export const deleteBrand = async (id: string) => {
    await BrandModel.findByIdAndDelete(id);
};
