import { v2 as cloudinary } from "cloudinary";

import Logging from "../library/Logging";
import tempUploadsService from "../services/tempUploadsService";
import type {
    ImageDocument,
    ImageOptions,
    ImageUploadResponse,
} from "../types/upload";

export const handleImageUpload = async <T extends ImageDocument>(
    doc: T,
    { filename, folder, secureUrl }: ImageOptions
) => {
    const publicId = tempUploadsService.get(secureUrl);

    if (!publicId) return;

    try {
        const displayName = filename || doc._id;

        await cloudinary.uploader.explicit(publicId, {
            asset_folder: folder,
            display_name: displayName,
            invalidate: true,
            type: "upload",
        });

        const renamed: ImageUploadResponse = await cloudinary.uploader.rename(
            publicId,
            `${folder}/${displayName}`,
            { invalidate: true }
        );

        doc.imageId = renamed.public_id;
        doc.imageUrl = renamed.secure_url;

        tempUploadsService.remove(secureUrl);
    } catch (error) {
        Logging.error(`Error handling image upload for "${folder}":`);
        Logging.error(error);
        throw error;
    }
};

export const handleImageUpdate = async <T extends ImageDocument>(
    doc: T,
    { destroyOnReplace = true, folder, secureUrl }: ImageOptions
) => {
    const publicId = tempUploadsService.get(secureUrl);

    if (publicId) {
        try {
            const renamed: ImageUploadResponse =
                await cloudinary.uploader.rename(
                    publicId,
                    `${folder}/${doc._id}`,
                    { invalidate: true, overwrite: true }
                );

            const moved: ImageUploadResponse =
                await cloudinary.uploader.explicit(renamed.public_id, {
                    asset_folder: folder,
                    display_name: doc._id,
                    invalidate: true,
                    type: "upload",
                });

            doc.imageId = moved.public_id;
            doc.imageUrl = moved.secure_url;

            tempUploadsService.remove(secureUrl);
        } catch (error) {
            Logging.error(`Error handling image update for "${folder}":`);
            Logging.error(error);
            throw error;
        }
    }

    if (doc.imageId && !secureUrl.includes("cloudinary")) {
        if (destroyOnReplace) {
            try {
                await cloudinary.uploader.destroy(doc.imageId);
            } catch (error) {
                Logging.error("Error deleting image:");
                Logging.error(error);
            }
        }

        doc.imageId = undefined;
    }
};

export const handleImageDeletion = async (publicId?: string): Promise<void> => {
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        Logging.error("Error deleting image:");
        Logging.error(error);
    }
};
