import { v2 as cloudinary } from "cloudinary";

import config from "../config";
import QuestionnaireModel from "../models/QuestionnaireModel";
import type {
    Questionnaire,
    QuestionnaireDocument,
} from "../models/QuestionnaireModel";
import { NotFoundError } from "../utils/AppErrors";
import { handleImageUpload } from "./ImageService";

cloudinary.config(config.cloudinary);

const createImageAdapter = (questionnaire: QuestionnaireDocument) => ({
    ...questionnaire,
    imageId: questionnaire.makeupBagPhotoId,
    imageUrl: questionnaire.makeupBagPhotoUrl || "",
});

export const createQuestionnaire = async (data: Questionnaire) => {
    const questionnaire = new QuestionnaireModel(data);
    const { makeupBagPhotoUrl } = data;

    if (makeupBagPhotoUrl) {
        const adapter = createImageAdapter(questionnaire);

        await handleImageUpload(adapter, {
            filename: "makeup-bag",
            folder: `questionnaires/${questionnaire._id}`,
            secureUrl: makeupBagPhotoUrl,
        });

        questionnaire.makeupBagPhotoId = adapter.imageId;
        questionnaire.makeupBagPhotoUrl = adapter.imageUrl;
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
