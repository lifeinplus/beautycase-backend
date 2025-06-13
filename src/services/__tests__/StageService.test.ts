import { mockProduct1 } from "../../tests/mocks/product";
import { mockStageId, mockStage1, mockStage2 } from "../../tests/mocks/stage";
import { NotFoundError } from "../../utils/AppErrors";
import * as ImageService from "../ImageService";
import * as ProductService from "../ProductService";
import * as StageService from "../StageService";

jest.mock("../ImageService");

const mockImageService = ImageService as jest.Mocked<typeof ImageService>;

describe("StageService", () => {
    describe("createStage", () => {
        it("should create a stage", async () => {
            const result = await StageService.createStage(mockStage1);

            expect(result).toHaveProperty("_id");
            expect(result.title).toBe(mockStage1.title);

            expect(mockImageService.handleImageUpload).toHaveBeenCalled();
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
    });

    describe("deleteStageById", () => {
        it("should delete a stage", async () => {
            const stage = await StageService.createStage(mockStage1);

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
