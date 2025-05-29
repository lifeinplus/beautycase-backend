import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";

import config from "../config";
import QuestionnaireModel from "../models/QuestionnaireModel";
import tempUploadsService from "../services/tempUploadsService";
import { NotFoundError } from "../utils/AppErrors";

cloudinary.config(config.cloudinary);

export const createQuestionnaire = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const questionnaire = new QuestionnaireModel(body);
        const publicId = tempUploadsService.get(body.makeupBagPhotoUrl);

        if (publicId) {
            await cloudinary.uploader.explicit(publicId, {
                asset_folder: `questionnaires/${questionnaire._id}`,
                display_name: "makeup-bag",
                invalidate: true,
                type: "upload",
            });

            const response = await cloudinary.uploader.rename(
                publicId,
                `questionnaires/${questionnaire._id}/makeup-bag`,
                { invalidate: true }
            );

            questionnaire.makeupBagPhotoId = response?.public_id;
            questionnaire.makeupBagPhotoUrl = response?.secure_url;
            tempUploadsService.remove(body.imageUrl);
        }

        await questionnaire.save();

        res.status(201).json({
            count: 1,
            id: questionnaire._id,
            message: "Questionnaire created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const readQuestionnaire = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const questionnaire = await QuestionnaireModel.findById(id);

        if (!questionnaire) {
            throw new NotFoundError("Questionnaire not found");
        }

        res.status(200).json(questionnaire);
    } catch (error) {
        next(error);
    }
};

export const readQuestionnaires = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const questionnaires = await QuestionnaireModel.find();

        if (!questionnaires.length) {
            throw new NotFoundError("Questionnaires not found");
        }

        res.status(200).json(questionnaires);
    } catch (error) {
        next(error);
    }
};
