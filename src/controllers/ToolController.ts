import { NextFunction, Request, Response } from "express";

import { ToolModel } from "../models";
import { BadRequestError, NotFoundError } from "../utils";

export const addTool = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tool = new ToolModel(req.body);
        await tool.save();
        res.status(201).json({
            message: "Tool added successfully",
            count: 1,
        });
    } catch (error) {
        next(error);
    }
};

export const addToolsList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tool = req.body;

    if (!Array.isArray(tool) || tool.length === 0) {
        throw new BadRequestError("Invalid tool list provided");
    }

    try {
        const createdTools = await ToolModel.insertMany(tool);
        res.status(201).json({
            message: "Tools added successfully",
            count: createdTools.length,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteToolById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        await ToolModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Tool successfully deleted" });
    } catch (error) {
        next(error);
    }
};

export const editTool = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { name, image, number, comment } = req.body;

    try {
        const tool = await ToolModel.findById(id).exec();

        if (!tool) {
            throw new NotFoundError("Tool not found");
        }

        tool.name = name;
        tool.image = image;
        tool.number = number;
        tool.comment = comment;

        await tool.save();

        res.status(200).json({ message: "Tool successfully changed" });
    } catch (error) {
        next(error);
    }
};

export const getToolById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const tool = await ToolModel.findById(id);

        if (!tool) {
            throw new NotFoundError("Tool not found");
        }

        res.status(200).json(tool);
    } catch (error) {
        next(error);
    }
};

export const getTools = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tools = await ToolModel.find();

        if (!tools.length) {
            throw new NotFoundError("Tools not found");
        }

        res.status(200).json(tools);
    } catch (error) {
        next(error);
    }
};
