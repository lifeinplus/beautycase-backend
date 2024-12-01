import { Request, Response } from "express";

import Logging from "../library/Logging";
import { ToolModel } from "../models";

export const getTools = async (req: Request, res: Response) => {
    try {
        const tool = await ToolModel.find();

        tool.length
            ? res.status(200).json(tool)
            : res.status(404).json({ message: "Tools not found" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};

export const addTool = async (req: Request, res: Response) => {
    try {
        const tool = new ToolModel(req.body);
        await tool.save();
        res.status(201).json({
            message: "Tool added successfully",
            count: 1,
        });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};

export const addToolsList = async (req: Request, res: Response) => {
    const tool = req.body;

    if (!Array.isArray(tool) || tool.length === 0) {
        res.status(400).json({ message: "Invalid tool list provided" });
    }

    try {
        const createdTools = await ToolModel.insertMany(tool);
        res.status(201).json({
            message: "Tools added successfully",
            count: createdTools.length,
        });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};
