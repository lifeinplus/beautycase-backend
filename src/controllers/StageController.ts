import { Request, Response } from "express";

import Logging from "../library/Logging";
import { StageModel } from "../models";

export const addStage = async (req: Request, res: Response) => {
    try {
        const stage = new StageModel(req.body);
        await stage.save();
        res.status(201).json({
            message: "Stage added successfully",
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

export const addStagesList = async (req: Request, res: Response) => {
    const stages = req.body;

    if (!Array.isArray(stages) || stages.length === 0) {
        res.status(400).json({ message: "Invalid stage list provided" });
    }

    try {
        const createdStages = await StageModel.insertMany(stages);
        res.status(201).json({
            message: "Stages added successfully",
            count: createdStages.length,
        });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};

export const getStages = async (req: Request, res: Response) => {
    try {
        const stages = await StageModel.find().populate("productIds");

        stages.length
            ? res.status(200).json(stages)
            : res.status(404).json({ message: "Stages not found" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};
