import CategoryModel from "../models/CategoryModel";
import type { Category } from "../models/CategoryModel";
import { NotFoundError } from "../utils/AppErrors";

export const createCategory = async (data: Category) => {
    const category = await CategoryModel.create(data);
    return category;
};

export const readCategories = async () => {
    const categories = await CategoryModel.find();

    if (!categories.length) {
        throw new NotFoundError("Categories not found");
    }

    return categories;
};
