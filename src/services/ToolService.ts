import ToolModel from "../models/ToolModel";
import type { Tool } from "../models/ToolModel";
import { NotFoundError } from "../utils/AppErrors";
import {
    handleImageDeletion,
    handleImageUpdate,
    handleImageUpload,
} from "./ImageService";

export const createTool = async (data: Tool) => {
    const tool = new ToolModel(data);
    const { imageUrl } = data;

    await handleImageUpload(tool, {
        folder: "tools",
        secureUrl: imageUrl,
    });

    await tool.save();
    return tool;
};

export const getAllTools = async () => {
    const tools = await ToolModel.find().select("imageUrl");

    if (!tools.length) {
        throw new NotFoundError("Tools not found");
    }

    return tools;
};

export const getToolById = async (id: string) => {
    const tool = await ToolModel.findById(id).populate("brandId");

    if (!tool) {
        throw new NotFoundError("Tool not found");
    }

    return tool;
};

export const updateToolById = async (id: string, data: Tool) => {
    const { imageUrl } = data;

    const tool = await ToolModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!tool) {
        throw new NotFoundError("Tool not found");
    }

    await handleImageUpdate(tool, {
        folder: "tools",
        secureUrl: imageUrl,
    });

    await tool.save();
    return tool;
};

export const deleteToolById = async (id: string) => {
    const tool = await ToolModel.findByIdAndDelete(id);

    if (!tool) {
        throw new NotFoundError("Tool not found");
    }

    await handleImageDeletion(tool.imageId);
    return tool;
};
