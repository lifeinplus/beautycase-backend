import StoreModel from "../models/StoreModel";
import type { Store } from "../models/StoreModel";
import { NotFoundError } from "../utils/AppErrors";

export const createStore = async (data: Store) => {
    return await StoreModel.create(data);
};

export const getAllStores = async () => {
    const stores = await StoreModel.find().sort("name");

    if (!stores.length) {
        throw new NotFoundError("Stores not found");
    }

    return stores;
};

export const updateStoreById = async (id: string, data: Store) => {
    const store = await StoreModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!store) {
        throw new NotFoundError("Store not found");
    }

    return store;
};

export const deleteStoreById = async (id: string) => {
    const store = await StoreModel.findByIdAndDelete(id);

    if (!store) {
        throw new NotFoundError("Store not found");
    }

    return store;
};
