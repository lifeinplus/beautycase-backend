import { v2 as cloudinary } from "cloudinary";

import { mockErrorCloudinary } from "../../tests/mocks/error";
import { mockProduct1 } from "../../tests/mocks/product";
import { mockStageId, mockStage1, mockStage2 } from "../../tests/mocks/stage";
import { NotFoundError } from "../../utils/AppErrors";
import * as ProductService from "../ProductService";
import * as StageService from "../StageService";
import tempUploadsService from "../tempUploadsService";

jest.mock("cloudinary");
jest.mock("../tempUploadsService");

const mockCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

const mockTempUploadsService = tempUploadsService as jest.Mocked<
    typeof tempUploadsService
>;

describe("StageService", () => {
    const mockPublicId = "test_public_id";

    const renamedResponse = {
        public_id: "stages/renamed-id",
        secure_url: "https://cloudinary.com/renamed-image.jpg",
    };

    beforeEach(() => {
        mockCloudinary.uploader.explicit = jest
            .fn()
            .mockResolvedValue(renamedResponse);

        mockCloudinary.uploader.rename = jest
            .fn()
            .mockResolvedValue(renamedResponse);

        mockTempUploadsService.get.mockReturnValue(mockPublicId);
    });

    describe("createStage", () => {
        it("should create a stage", async () => {
            const result = await StageService.createStage(mockStage1);

            expect(result).toHaveProperty("_id");
            expect(result.title).toBe(mockStage1.title);
            expect(result.imageId).toBe(renamedResponse.public_id);
            expect(result.imageUrl).toBe(renamedResponse.secure_url);

            expect(mockCloudinary.uploader.explicit).toHaveBeenCalledTimes(1);
            expect(mockCloudinary.uploader.rename).toHaveBeenCalledTimes(1);

            expect(mockTempUploadsService.remove).toHaveBeenCalledWith(
                mockStage1.imageUrl
            );
        });

        it("should skip image upload if no publicId found", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);

            const result = await StageService.createStage(mockStage1);

            expect(result.imageId).toBeUndefined();
            expect(result.imageUrl).toBe(mockStage1.imageUrl);

            expect(mockCloudinary.uploader.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.uploader.rename).not.toHaveBeenCalled();

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
        });

        it("should handle cloudinary upload errors", async () => {
            mockCloudinary.uploader.explicit = jest
                .fn()
                .mockRejectedValue(mockErrorCloudinary);

            const result = StageService.createStage(mockStage1);

            await expect(result).rejects.toThrow(mockErrorCloudinary.message);

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
        });
    });

    describe("duplicateStageById", () => {
        it("should duplicate an existing stage", async () => {
            const stage = await StageService.createStage(mockStage1);

            const result = await StageService.duplicateStageById(
                String(stage._id)
            );

            expect(result._id).not.toEqual(stage._id);
            expect(result.title).toMatch(/Копия/);
        });

        it("should throw NotFoundError when duplicating nonexistent stage", async () => {
            const result = StageService.duplicateStageById(mockStageId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getAllStages", () => {
        it("should get all stages", async () => {
            await StageService.createStage(mockStage1);
            await StageService.createStage(mockStage2);

            const result = await StageService.getAllStages();

            expect(result).toHaveLength(2);
            expect(result[0].title).toBe(mockStage1.title);
            expect(result[1].title).toBe(mockStage2.title);
        });

        it("should throw NotFoundError if no stages found", async () => {
            const result = StageService.getAllStages();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getStageById", () => {
        it("should get a stage with populated productIds", async () => {
            const product = await ProductService.createProduct(mockProduct1);

            const stage = await StageService.createStage({
                ...mockStage1,
                productIds: [String(product._id)],
            });

            const result = await StageService.getStageById(String(stage._id));

            expect(result._id).toEqual(stage._id);
        });

        it("should throw NotFoundError if stage not found", async () => {
            const result = StageService.getStageById(mockStageId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateStageById", () => {
        it("should update a stage", async () => {
            const stage = await StageService.createStage(mockStage1);

            const result = await StageService.updateStageById(
                String(stage._id),
                mockStage2
            );

            expect(result.title).toBe(mockStage2.title);
        });

        it("should throw NotFoundError if stage to update not found ", async () => {
            const result = StageService.updateStageById(
                mockStageId,
                mockStage2
            );

            await expect(result).rejects.toThrow(NotFoundError);
        });

        it("should handle cloudinary update errors", async () => {
            const stage = await StageService.createStage(mockStage1);

            mockCloudinary.uploader.rename = jest
                .fn()
                .mockRejectedValue(mockErrorCloudinary);

            const result = StageService.updateStageById(
                String(stage._id),
                mockStage2
            );

            await expect(result).rejects.toThrow(mockErrorCloudinary.message);
        });
    });

    describe("deleteStageById", () => {
        it("should delete a stage", async () => {
            const stage = await StageService.createStage({
                ...mockStage1,
                imageId: "stages/renamed-id",
            });

            const result = await StageService.deleteStageById(
                String(stage._id)
            );

            expect(result.title).toBe(mockStage1.title);
        });

        it("should throw NotFoundError if stage to delete not found", async () => {
            const result = StageService.deleteStageById(mockStageId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
