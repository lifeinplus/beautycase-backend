import { NextFunction, Request, Response } from "express";

import { QuestionnaireModel } from "../models";
import { NotFoundError } from "../utils";

export const addQuestionnaire = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const questionnaire = new QuestionnaireModel(req.body);

        const response = await questionnaire.save();

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
