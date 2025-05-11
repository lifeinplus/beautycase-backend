import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";

import { ToolModel } from "../models";
import { tempUploadsService } from "../services";
import { NotFoundError } from "../utils";

export const createTool = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const tool = new ToolModel(body);
        const publicId = tempUploadsService.get(body.imageUrl);

        if (publicId) {
            await cloudinary.uploader.explicit(publicId, {
                asset_folder: "tools",
                display_name: tool._id,
                invalidate: true,
                type: "upload",
            });

            const response = await cloudinary.uploader.rename(
                publicId,
                `tools/${tool._id}`,
                { invalidate: true }
            );

            tool.imageId = response.public_id;
            tool.imageUrl = response.secure_url;
            tempUploadsService.remove(body.imageUrl);
        }

        await tool.save();

        res.status(201).json({
            count: 1,
            id: tool._id,
            message: "Tool created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const readTool = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const tool = await ToolModel.findById(id).populate("brandId");

        if (!tool) {
            throw new NotFoundError("Tool not found");
        }

        res.status(200).json(tool);
    } catch (error) {
        next(error);
    }
};

export const readTools = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tools = await ToolModel.find().select("imageUrl");

        if (!tools.length) {
            throw new NotFoundError("Tools not found");
        }

        res.status(200).json(tools);
    } catch (error) {
        next(error);
    }
};

export const updateTool = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;

    const { id } = params;
    const { name, brandId, imageUrl, number, comment, storeLinks } = body;

    try {
        const tool = await ToolModel.findById(id).exec();

        if (!tool) {
            throw new NotFoundError("Tool not found");
        }

        tool.brandId = brandId;
        tool.name = name;
        tool.imageUrl = imageUrl;
        tool.number = number;
        tool.comment = comment;
        tool.storeLinks = storeLinks;

        const publicId = tempUploadsService.get(imageUrl);

        if (publicId) {
            const renamed = await cloudinary.uploader.rename(
                publicId,
                `tools/${tool._id}`,
                { invalidate: true, overwrite: true }
            );

            const moved = await cloudinary.uploader.explicit(
                renamed.public_id,
                {
                    asset_folder: "tools",
                    display_name: tool._id,
                    invalidate: true,
                    type: "upload",
                }
            );

            tool.imageId = moved.public_id;
            tool.imageUrl = moved.secure_url;
            tempUploadsService.remove(imageUrl);
        }

        if (tool.imageId && !imageUrl.includes("cloudinary")) {
            await cloudinary.uploader.destroy(tool.imageId);
            tool.imageId = undefined;
        }

        await tool.save();

        res.status(200).json({
            id: tool._id,
            message: "Tool updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTool = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const tool = await ToolModel.findById(id).exec();

        if (!tool) {
            throw new NotFoundError("Tool not found");
        }

        if (tool.imageId) {
            await cloudinary.uploader.destroy(tool.imageId);
        }

        await ToolModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Tool deleted successfully" });
    } catch (error) {
        next(error);
    }
};
