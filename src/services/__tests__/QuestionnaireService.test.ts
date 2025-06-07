import { v2 as cloudinary } from "cloudinary";

import { mockErrorCloudinary } from "../../tests/mocks/error";
import {
    mockQuestionnaireId,
    mockQuestionnaire1,
    mockQuestionnaire2,
} from "../../tests/mocks/questionnaire";
import { NotFoundError } from "../../utils/AppErrors";
import * as QuestionnaireService from "../QuestionnaireService";
import tempUploadsService from "../tempUploadsService";

jest.mock("cloudinary");
jest.mock("../tempUploadsService");

const mockCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

const mockTempUploadsService = tempUploadsService as jest.Mocked<
    typeof tempUploadsService
>;

describe("QuestionnaireService", () => {
    const mockPublicId = "test_public_id";

    const mockCloudinaryResponse = {
        public_id: "questionnaires/renamed-id",
        secure_url: "https://cloudinary.com/renamed-image.jpg",
    };

    beforeEach(() => {
        mockCloudinary.uploader.explicit = jest.fn().mockResolvedValue({});

        mockCloudinary.uploader.rename = jest
            .fn()
            .mockResolvedValue(mockCloudinaryResponse);

        mockTempUploadsService.get.mockReturnValue(mockPublicId);
    });

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
            expect(result.makeupBagPhotoId).toBe(
                mockCloudinaryResponse.public_id
            );
            expect(result.makeupBagPhotoUrl).toBe(
                mockCloudinaryResponse.secure_url
            );

            expect(mockCloudinary.uploader.explicit).toHaveBeenCalledTimes(1);
            expect(mockCloudinary.uploader.rename).toHaveBeenCalledTimes(1);

            expect(mockTempUploadsService.remove).toHaveBeenCalledWith(
                mockQuestionnaire2.makeupBagPhotoUrl
            );
        });

        it("should skip image upload if no publicId found", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);

            const result = await QuestionnaireService.createQuestionnaire(
                mockQuestionnaire2
            );

            expect(result.makeupBagPhotoId).toBeUndefined();
            expect(result.makeupBagPhotoUrl).toBe(
                mockQuestionnaire2.makeupBagPhotoUrl
            );

            expect(mockCloudinary.uploader.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.uploader.rename).not.toHaveBeenCalled();

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
        });

        it("should handle cloudinary upload errors", async () => {
            mockCloudinary.uploader.explicit = jest
                .fn()
                .mockRejectedValue(mockErrorCloudinary);

            const result =
                QuestionnaireService.createQuestionnaire(mockQuestionnaire2);

            await expect(result).rejects.toThrow(mockErrorCloudinary.message);

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
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
