import MakeupBagModel from "../models/MakeupBagModel";
import type { MakeupBag } from "../models/MakeupBagModel";
import { NotFoundError } from "../utils/AppErrors";

export const createMakeupBag = async (data: MakeupBag) => {
    const makeupBag = new MakeupBagModel(data);
    return await makeupBag.save();
};

export const readMakeupBag = async (id: string) => {
    const makeupBag = await MakeupBagModel.findById(id).populate([
        { path: "categoryId" },
        { path: "clientId", select: "username" },
        {
            path: "stageIds",
            populate: {
                path: "productIds",
                populate: { path: "brandId" },
                select: "name imageUrl",
            },
        },
        {
            path: "toolIds",
            select: "brandId imageUrl name",
            populate: { path: "brandId" },
        },
    ]);

    if (!makeupBag) {
        throw new NotFoundError("MakeupBag not found");
    }

    return makeupBag;
};

export const readMakeupBags = async () => {
    const makeupBags = await MakeupBagModel.find()
        .select("categoryId clientId createdAt stageIds")
        .populate([
            { path: "categoryId", select: "name" },
            { path: "clientId", select: "username" },
            { path: "stageIds", select: "_id" },
        ]);

    if (!makeupBags.length) {
        throw new NotFoundError("MakeupBags not found");
    }

    return makeupBags;
};

export const readMakeupBagsByClientId = async (clientId: string) => {
    return await MakeupBagModel.find({ clientId })
        .select("categoryId")
        .populate("categoryId", "name");
};

export const updateMakeupBag = async (id: string, data: MakeupBag) => {
    const makeupBag = await MakeupBagModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!makeupBag) {
        throw new NotFoundError("MakeupBag not found");
    }

    return makeupBag;
};

export const deleteMakeupBag = async (id: string) => {
    const makeupBag = await MakeupBagModel.findByIdAndDelete(id);

    if (!makeupBag) {
        throw new NotFoundError("MakeupBag not found");
    }

    return makeupBag;
};
