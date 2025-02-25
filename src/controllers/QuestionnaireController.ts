import {
    v2 as cloudinary,
    type UploadApiOptions,
    type UploadApiResponse,
} from "cloudinary";
import { NextFunction, Request, Response } from "express";

import config from "../config";
import { QuestionnaireModel } from "../models";
import { AppError, NotFoundError } from "../utils";

cloudinary.config(config.cloudinary);

export const addQuestionnaire = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body, file } = req;

    try {
        const questionnaire = new QuestionnaireModel(body);
        const response = await questionnaire.save();

        if (file) {
            const fileBuffer = file.buffer;

            const options: UploadApiOptions = {
                folder: `questionnaires/${response._id}`,
                overwrite: true,
                public_id: "makeup-bag",
                unique_filename: false,
                use_filename: false,
            };

            const uploadResult: UploadApiResponse | undefined =
                await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(options, (error, result) => {
                            if (error) {
                                return reject(
                                    new AppError(error.http_code, error.message)
                                );
                            }
                            resolve(result);
                        })
                        .end(fileBuffer);
                });

            questionnaire.makeupBagPhotoId = uploadResult?.public_id;
            await questionnaire.save();
        }

        res.status(201).json({
            count: 1,
            id: response._id,
            message: "Questionnaire added successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getQuestionnaireById = async (
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

export const getQuestionnaires = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const questionnaires = await QuestionnaireModel.find();

        if (!questionnaires) {
            throw new NotFoundError("Questionnaires not found");
        }

        res.status(200).json(questionnaires);
    } catch (error) {
        next(error);
    }
};
