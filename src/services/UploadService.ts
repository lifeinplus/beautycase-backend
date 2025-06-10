import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

import type { ImageUploadResponse } from "../types/upload";
import { BadRequestError } from "../utils/AppErrors";
import tempUploadsService from "./tempUploadsService";

export const uploadImageTemp = async (
    folder: string,
    file?: Express.Multer.File
) => {
    if (!file) {
        throw new BadRequestError("File upload failed");
    }

    const fileStr = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${fileStr}`;

    const options: UploadApiOptions = {
        folder: `${folder}/temp`,
        overwrite: true,
        resource_type: "auto",
        unique_filename: true,
        use_filename: false,
    };

    const uploadResult: ImageUploadResponse = await cloudinary.uploader.upload(
        dataUri,
        options
    );

    tempUploadsService.store(uploadResult.secure_url, uploadResult.public_id);

    return uploadResult.secure_url;
};
