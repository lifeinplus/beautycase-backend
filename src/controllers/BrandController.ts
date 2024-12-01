import { Request, Response } from "express";

import Logging from "../library/Logging";
import { BrandModel } from "../models";

export const getBrands = async (req: Request, res: Response) => {
    try {
        const brands = await BrandModel.find().populate("toolIds");

        brands.length
            ? res.status(200).json(brands)
            : res.status(404).json({ message: "Brands not found" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }

        res.status(500).json({ error });
    }
};

export const addBrand = async (req: Request, res: Response) => {
    try {
        const brand = new BrandModel(req.body);
        await brand.save();
        res.status(201).json({
            message: "Brand added successfully",
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
