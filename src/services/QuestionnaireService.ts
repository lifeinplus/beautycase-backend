import { v2 as cloudinary } from "cloudinary";

import config from "../config";
import Logging from "../library/Logging";
import QuestionnaireModel from "../models/QuestionnaireModel";
import type {
    Questionnaire,
    QuestionnaireDocument,
} from "../models/QuestionnaireModel";
import type { CloudinaryUploadResponse } from "../types/upload";
import { NotFoundError } from "../utils/AppErrors";
import tempUploadsService from "./tempUploadsService";

cloudinary.config(config.cloudinary);

const handleImageUpload = async (
    questionnaire: QuestionnaireDocument,
    imageUrl: string
) => {
    const publicId = tempUploadsService.get(imageUrl);

    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.explicit(publicId, {
            asset_folder: `questionnaires/${questionnaire._id}`,
            display_name: "makeup-bag",
            invalidate: true,
            type: "upload",
        });

        const renamed: CloudinaryUploadResponse =
            await cloudinary.uploader.rename(
                publicId,
                `questionnaires/${questionnaire._id}/makeup-bag`,
                { invalidate: true }
            );

        questionnaire.makeupBagPhotoId = renamed?.public_id;
        questionnaire.makeupBagPhotoUrl = renamed?.secure_url;

        tempUploadsService.remove(imageUrl);
    } catch (error) {
        Logging.error("Error handling image upload:");
        Logging.error(error);
        throw error;
    }
};

export const createQuestionnaire = async (data: Questionnaire) => {
    const questionnaire = new QuestionnaireModel(data);
    const { makeupBagPhotoUrl } = data;

    if (makeupBagPhotoUrl) {
        await handleImageUpload(questionnaire, makeupBagPhotoUrl);
    }

    await questionnaire.save();

    return questionnaire;
};

export const getAllQuestionnaires = async () => {
    const questionnaires = await QuestionnaireModel.find();

    if (!questionnaires.length) {
        throw new NotFoundError("Questionnaires not found");
    }

    return questionnaires;
};

export const getQuestionnaireById = async (id: string) => {
    const questionnaire = await QuestionnaireModel.findById(id);

    if (!questionnaire) {
        throw new NotFoundError("Questionnaire not found");
    }

    return questionnaire;
};
