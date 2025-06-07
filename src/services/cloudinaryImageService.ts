import { v2 as cloudinary } from "cloudinary";
import Logging from "../library/Logging";
import tempUploadsService from "../services/tempUploadsService";
import { CloudinaryUploadResponse } from "../types/upload";

interface ImageDocument {
    _id: unknown;
    imageId?: string;
    imageUrl: string;
}

export const handleImageUpdate = async <T extends ImageDocument>(
    doc: T,
    imageUrl: string,
    folder: string
) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (publicId) {
        try {
            const renamed: CloudinaryUploadResponse =
                await cloudinary.uploader.rename(
                    publicId,
                    `${folder}/${doc._id}`,
                    { invalidate: true, overwrite: true }
                );

            const moved: CloudinaryUploadResponse =
                await cloudinary.uploader.explicit(renamed.public_id, {
                    asset_folder: folder,
                    display_name: doc._id,
                    invalidate: true,
                    type: "upload",
                });

            doc.imageId = moved.public_id;
            doc.imageUrl = moved.secure_url;

            tempUploadsService.remove(imageUrl);
        } catch (error) {
            Logging.error("Error handling image update:");
            Logging.error(error);
            throw error;
        }
    }

    if (doc.imageId && !imageUrl.includes("cloudinary")) {
        await cloudinary.uploader.destroy(doc.imageId);
        doc.imageId = undefined;
    }
};

export const handleImageUpload = async <T extends ImageDocument>(
    doc: T,
    imageUrl: string,
    folder: string
) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.explicit(publicId, {
            asset_folder: folder,
            display_name: doc._id,
            invalidate: true,
            type: "upload",
        });

        const renamed: CloudinaryUploadResponse =
            await cloudinary.uploader.rename(publicId, `${folder}/${doc._id}`, {
                invalidate: true,
            });

        doc.imageId = renamed.public_id;
        doc.imageUrl = renamed.secure_url;

        tempUploadsService.remove(imageUrl);
    } catch (error) {
        Logging.error(`Error handling image upload for folder "${folder}":`);
        Logging.error(error);
        throw error;
    }
};
