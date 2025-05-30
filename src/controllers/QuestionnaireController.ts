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
        const questionnaire = await QuestionnaireService.readQuestionnaire(id);
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
        const questionnaires = await QuestionnaireService.readQuestionnaires();
        res.status(200).json(questionnaires);
    } catch (error) {
        next(error);
    }
};
