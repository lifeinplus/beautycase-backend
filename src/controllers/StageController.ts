import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";

import { StageModel } from "../models";
import { tempUploadsService } from "../services";
import { NotFoundError } from "../utils";

export const createStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const stage = new StageModel(body);
        const publicId = tempUploadsService.get(body.imageUrl);

        if (publicId) {
            await cloudinary.uploader.explicit(publicId, {
                asset_folder: "stages",
                display_name: stage._id,
                invalidate: true,
                type: "upload",
            });

            const response = await cloudinary.uploader.rename(
                publicId,
                `stages/${stage._id}`,
                { invalidate: true }
            );

            stage.imageId = response.public_id;
            stage.imageUrl = response.secure_url;
            tempUploadsService.remove(body.imageUrl);
        }

        await stage.save();

        res.status(201).json({
            count: 1,
            id: stage._id,
            message: "Stage added successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const duplicateStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { params } = req;
    const { id } = params;

    try {
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

        res.status(201).json({
            count: 1,
            id: duplicatedStage._id,
            message: "Stage duplicated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const stage = await StageModel.findById(id).exec();

        if (!stage) {
            throw new NotFoundError("Stage not found");
        }

        await StageModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Stage successfully deleted" });
    } catch (error) {
        next(error);
    }
};

export const updateStage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;

    const { id } = params;
    const { title, subtitle, imageUrl, comment, steps, productIds } = body;

    try {
        const stage = await StageModel.findById(id).exec();

        if (!stage) {
            throw new NotFoundError("Stage not found");
        }

        stage.title = title;
        stage.subtitle = subtitle;
        stage.imageUrl = imageUrl;
        stage.comment = comment;
        stage.steps = steps;
        stage.productIds = productIds;

        const publicId = tempUploadsService.get(imageUrl);

        if (publicId) {
            const renamed = await cloudinary.uploader.rename(
                publicId,
                `stages/${stage._id}`,
                { invalidate: true, overwrite: true }
            );

            const moved = await cloudinary.uploader.explicit(
                renamed.public_id,
                {
                    asset_folder: "stages",
                    display_name: stage._id,
                    invalidate: true,
                    type: "upload",
                }
            );

            stage.imageId = moved.public_id;
            stage.imageUrl = moved.secure_url;
            tempUploadsService.remove(imageUrl);
        }

        if (stage.imageId && !imageUrl.includes("cloudinary")) {
            stage.imageId = undefined;
        }

        await stage.save();

        res.status(200).json({
            id: stage._id,
            message: "Stage successfully changed",
        });
    } catch (error) {
        next(error);
    }
};

export const readStageById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const stage = await StageModel.findById(id).populate(
            "productIds",
            "imageUrl"
        );

        if (!stage) {
            throw new NotFoundError("Stage not found");
        }

        res.status(200).json(stage);
    } catch (error) {
        next(error);
    }
};

export const readStages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stages = await StageModel.find().select(
            "createdAt imageUrl subtitle title"
        );

        if (!stages.length) {
            throw new NotFoundError("Stages not found");
        }

        res.status(200).json(stages);
    } catch (error) {
        next(error);
    }
};
