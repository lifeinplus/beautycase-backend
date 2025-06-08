import StageModel from "../models/StageModel";
import type { Stage } from "../models/StageModel";
import { NotFoundError } from "../utils/AppErrors";
import { handleImageUpdate, handleImageUpload } from "./cloudinaryImageService";

export const createStage = async (data: Stage) => {
    const stage = new StageModel(data);
    const { imageUrl } = data;

    await handleImageUpload(stage, {
        folder: "stages",
        secureUrl: imageUrl,
    });

    await stage.save();
    return stage;
};

export const duplicateStageById = async (id: string) => {
    const stage = await StageModel.findById(id).exec();

    if (!stage) {
        throw new NotFoundError("Stage not found");
    }

    const duplicatedStage = new StageModel({
        ...stage.toObject(),
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        title: `${stage.title} (Копия)`,
    });

    await duplicatedStage.save();
    return duplicatedStage;
};

export const getAllStages = async () => {
    const stages = await StageModel.find().select(
        "createdAt imageUrl subtitle title"
    );

    if (!stages.length) {
        throw new NotFoundError("Stages not found");
    }

    return stages;
};

export const getStageById = async (id: string) => {
    const stage = await StageModel.findById(id).populate(
        "productIds",
        "imageUrl"
    );

    if (!stage) {
        throw new NotFoundError("Stage not found");
    }

    return stage;
};

export const updateStageById = async (id: string, data: Stage) => {
    const { imageUrl } = data;

    const stage = await StageModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!stage) {
        throw new NotFoundError("Stage not found");
    }

    await handleImageUpdate(stage, {
        destroyOnReplace: false,
        folder: "stages",
        secureUrl: imageUrl,
    });

    await stage.save();
    return stage;
};

export const deleteStageById = async (id: string) => {
    const stage = await StageModel.findByIdAndDelete(id);

    if (!stage) {
        throw new NotFoundError("Stage not found");
    }

    return stage;
};
