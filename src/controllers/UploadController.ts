import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import { NextFunction, Request, Response } from "express";

import tempUploadsService from "../services/tempUploadsService";
import { BadRequestError } from "../utils/AppErrors";

export const uploadImageTemp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, file } = req;

    try {
        if (!file) {
            throw new BadRequestError("File upload failed");
        }

        const fileStr = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${fileStr}`;

        const options: UploadApiOptions = {
            folder: `${body.folder}/temp`,
            overwrite: true,
            resource_type: "auto",
            unique_filename: true,
            use_filename: false,
        };

        const uploadResult = await cloudinary.uploader.upload(dataUri, options);

        tempUploadsService.store(
            uploadResult.secure_url,
            uploadResult.public_id
        );

        res.status(200).json({
            imageUrl: uploadResult.secure_url,
        });
    } catch (error) {
        next(error);
    }
};
