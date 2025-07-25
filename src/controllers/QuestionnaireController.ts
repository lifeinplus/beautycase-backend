import { NextFunction, Request, Response } from "express";

import * as QuestionnaireService from "../services/QuestionnaireService";

export const createQuestionnaire = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        const questionnaire = await QuestionnaireService.createQuestionnaire(
            body
        );

        res.status(201).json({
            id: questionnaire._id,
            message: "Questionnaire created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllQuestionnaires = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const questionnaires =
            await QuestionnaireService.getAllQuestionnaires();
        res.status(200).json(questionnaires);
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
        const questionnaire = await QuestionnaireService.getQuestionnaireById(
            id
        );

        res.status(200).json(questionnaire);
    } catch (error) {
        next(error);
    }
};
