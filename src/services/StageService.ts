import { v2 as cloudinary } from "cloudinary";

import Logging from "../library/Logging";
import StageModel from "../models/StageModel";
import type { Stage, StageDocument } from "../models/StageModel";
import type { CloudinaryUploadResponse } from "../types/upload";
import { NotFoundError } from "../utils/AppErrors";
import tempUploadsService from "./tempUploadsService";

const handleImageUpdate = async (stage: StageDocument, imageUrl: string) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (publicId) {
        try {
            const renamed: CloudinaryUploadResponse =
                await cloudinary.uploader.rename(
                    publicId,
                    `stages/${stage._id}`,
                    { invalidate: true, overwrite: true }
                );

            const moved: CloudinaryUploadResponse =
                await cloudinary.uploader.explicit(renamed.public_id, {
                    asset_folder: "stages",
                    display_name: stage._id,
                    invalidate: true,
                    type: "upload",
                });

            stage.imageId = moved.public_id;
            stage.imageUrl = moved.secure_url;

            tempUploadsService.remove(imageUrl);
        } catch (error) {
            Logging.error("Error handling image update:");
            Logging.error(error);
            throw error;
        }
    }

    if (stage.imageId && !imageUrl.includes("cloudinary")) {
        stage.imageId = undefined;
    }
};

const handleImageUpload = async (stage: StageDocument, imageUrl: string) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.explicit(publicId, {
            asset_folder: "stages",
            display_name: stage._id,
            invalidate: true,
            type: "upload",
        });

        const renamed: CloudinaryUploadResponse =
            await cloudinary.uploader.rename(publicId, `stages/${stage._id}`, {
                invalidate: true,
            });

        stage.imageId = renamed.public_id;
        stage.imageUrl = renamed.secure_url;

        tempUploadsService.remove(imageUrl);
    } catch (error) {
        Logging.error("Error handling image upload:");
        Logging.error(error);
        throw error;
    }
};

export const createStage = async (data: Stage) => {
    const stage = new StageModel(data);

    if (data.imageUrl) {
        await handleImageUpload(stage, data.imageUrl);
    }

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

    await handleImageUpdate(stage, imageUrl);
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
