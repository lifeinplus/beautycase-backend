import {
    mockQuestionnaireId,
    mockQuestionnaire1,
    mockQuestionnaire2,
} from "../../tests/mocks/questionnaire";
import { NotFoundError } from "../../utils/AppErrors";
import * as ImageService from "../ImageService";
import * as QuestionnaireService from "../QuestionnaireService";

jest.mock("../ImageService");

const mockImageService = ImageService as jest.Mocked<typeof ImageService>;

describe("QuestionnaireService", () => {
    describe("createQuestionnaire", () => {
        it("should create a questionnaire without image", async () => {
            const result = await QuestionnaireService.createQuestionnaire(
                mockQuestionnaire1
            );

            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockQuestionnaire1.name);
            expect(result.makeupBagPhotoId).toBeUndefined();
        });

        it("should create a questionnaire with image", async () => {
            const result = await QuestionnaireService.createQuestionnaire(
                mockQuestionnaire2
            );

            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockQuestionnaire2.name);

            expect(mockImageService.handleImageUpload).toHaveBeenCalled();
        });
    });

    describe("getAllQuestionnaires", () => {
        it("should get all questionnaires", async () => {
            await QuestionnaireService.createQuestionnaire(mockQuestionnaire1);
            await QuestionnaireService.createQuestionnaire(mockQuestionnaire2);

            const result = await QuestionnaireService.getAllQuestionnaires();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe(mockQuestionnaire1.name);
            expect(result[1].name).toBe(mockQuestionnaire2.name);
        });

        it("should throw NotFoundError if no questionnaires found", async () => {
            const result = QuestionnaireService.getAllQuestionnaires();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getQuestionnaireById", () => {
        it("should get a questionnaire", async () => {
            const questionnaire =
                await QuestionnaireService.createQuestionnaire(
                    mockQuestionnaire1
                );

            const result = await QuestionnaireService.getQuestionnaireById(
                String(questionnaire._id)
            );

            expect(result._id).toEqual(questionnaire._id);
        });

        it("should throw NotFoundError if questionnaire not found", async () => {
            const result =
                QuestionnaireService.getQuestionnaireById(mockQuestionnaireId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
