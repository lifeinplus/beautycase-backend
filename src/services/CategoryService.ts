import CategoryModel from "../models/CategoryModel";
import type { Category } from "../models/CategoryModel";
import { NotFoundError } from "../utils/AppErrors";

export const createCategory = async (data: Category) => {
    return await CategoryModel.create(data);
};

export const getAllCategories = async () => {
    const categories = await CategoryModel.find();

    if (!categories.length) {
        throw new NotFoundError("Categories not found");
    }

    return categories;
};
