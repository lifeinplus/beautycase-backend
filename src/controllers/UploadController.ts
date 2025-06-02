import { NextFunction, Request, Response } from "express";

import * as UploadService from "../services/UploadService";

export const uploadImageTemp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, file } = req;

    try {
        const imageUrl = await UploadService.uploadImageTemp(body.folder, file);
        res.status(200).json({ imageUrl });
    } catch (error) {
        next(error);
    }
};
