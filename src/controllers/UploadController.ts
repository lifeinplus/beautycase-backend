import { NextFunction, Request, Response } from "express";

import * as UploadService from "../services/UploadService";

export const uploadTempImageByFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { folder } = req.body;

    try {
        const secureUrl = await UploadService.uploadTempImageByFile(
            folder,
            req.file
        );

        res.status(200).json({ imageUrl: secureUrl });
    } catch (error) {
        next(error);
    }
};

export const uploadTempImageByUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { folder, imageUrl } = req.body;

    try {
        const secureUrl = await UploadService.uploadTempImageByUrl(
            folder,
            imageUrl
        );

        res.status(200).json({ imageUrl: secureUrl });
    } catch (error) {
        next(error);
    }
};
