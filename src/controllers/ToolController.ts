import { NextFunction, Request, Response } from "express";

import * as ToolService from "../services/ToolService";

export const createTool = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const tool = await ToolService.createTool(body);

        res.status(201).json({
            count: 1,
            id: tool._id,
            message: "Tool created successfully",
        });
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
        const tool = await ToolService.getToolById(id);
        res.status(200).json(tool);
    } catch (error) {
        next(error);
    }
};

export const getAllTools = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tools = await ToolService.getAllTools();
        res.status(200).json(tools);
    } catch (error) {
        next(error);
    }
};

export const updateToolById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, params } = req;
    const { id } = params;

    try {
        const tool = await ToolService.updateToolById(id, body);

        res.status(200).json({
            id: tool._id,
            message: "Tool updated successfully",
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
        const tool = await ToolService.deleteToolById(id);

        res.status(200).json({
            id: tool._id,
            message: "Tool deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
