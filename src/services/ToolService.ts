import { v2 as cloudinary } from "cloudinary";

import Logging from "../library/Logging";
import ToolModel from "../models/ToolModel";
import type { Tool, ToolDocument } from "../models/ToolModel";
import type { CloudinaryUploadResponse } from "../types/upload";
import { NotFoundError } from "../utils/AppErrors";
import tempUploadsService from "./tempUploadsService";

const handleImageUpdate = async (tool: ToolDocument, imageUrl: string) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (publicId) {
        try {
            const renamed: CloudinaryUploadResponse =
                await cloudinary.uploader.rename(
                    publicId,
                    `tools/${tool._id}`,
                    { invalidate: true, overwrite: true }
                );

            const moved: CloudinaryUploadResponse =
                await cloudinary.uploader.explicit(renamed.public_id, {
                    asset_folder: "tools",
                    display_name: tool._id,
                    invalidate: true,
                    type: "upload",
                });

            tool.imageId = moved.public_id;
            tool.imageUrl = moved.secure_url;

            tempUploadsService.remove(imageUrl);
        } catch (error) {
            Logging.error("Error handling image update:");
            Logging.error(error);
            throw error;
        }
    }

    if (tool.imageId && !imageUrl.includes("cloudinary")) {
        await cloudinary.uploader.destroy(tool.imageId);
        tool.imageId = undefined;
    }
};

const handleImageUpload = async (tool: ToolDocument, imageUrl: string) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.explicit(publicId, {
            asset_folder: "tools",
            display_name: tool._id,
            invalidate: true,
            type: "upload",
        });

        const renamed: CloudinaryUploadResponse =
            await cloudinary.uploader.rename(publicId, `tools/${tool._id}`, {
                invalidate: true,
            });

        tool.imageId = renamed.public_id;
        tool.imageUrl = renamed.secure_url;

        tempUploadsService.remove(imageUrl);
    } catch (error) {
        Logging.error("Error handling image update:");
        Logging.error(error);
        throw error;
    }
};

export const createTool = async (data: Tool) => {
    const tool = new ToolModel(data);

    await handleImageUpload(tool, data.imageUrl);
    await tool.save();

    return tool;
};

export const getToolById = async (id: string) => {
    const tool = await ToolModel.findById(id).populate("brandId");

    if (!tool) {
        throw new NotFoundError("Tool not found");
    }

    return tool;
};

export const getAllTools = async () => {
    const tools = await ToolModel.find().select("imageUrl");

    if (!tools.length) {
        throw new NotFoundError("Tools not found");
    }

    return tools;
};

export const updateToolById = async (id: string, data: Tool) => {
    const { name, brandId, imageUrl, number, comment, storeLinks } = data;

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

    await handleImageUpdate(tool, imageUrl);
    await tool.save();

    return tool;
};

export const deleteToolById = async (id: string) => {
    const tool = await ToolModel.findByIdAndDelete(id);

    if (!tool) {
        throw new NotFoundError("Tool not found");
    }

    if (tool.imageId) {
        await cloudinary.uploader.destroy(tool.imageId);
    }

    return tool;
};
