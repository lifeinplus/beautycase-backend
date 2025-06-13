import { mockBrand1 } from "../../tests/mocks/brand";
import { mockToolId, mockTool1, mockTool2 } from "../../tests/mocks/tool";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";
import * as ImageService from "../ImageService";
import * as ToolService from "../ToolService";

jest.mock("../ImageService");

const mockImageService = ImageService as jest.Mocked<typeof ImageService>;

describe("ToolService", () => {
    describe("createTool", () => {
        it("should create a tool", async () => {
            const result = await ToolService.createTool(mockTool1);

            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockTool1.name);

            expect(mockImageService.handleImageUpload).toHaveBeenCalled();
        });
    });

    describe("getAllTools", () => {
        it("should get all tools (imageUrl only)", async () => {
            await ToolService.createTool(mockTool1);
            await ToolService.createTool(mockTool2);

            const result = await ToolService.getAllTools();

            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty("imageUrl");
            expect(result[0].name).toBeUndefined();
        });

        it("should throw NotFoundError if no tools found", async () => {
            const result = ToolService.getAllTools();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getToolById", () => {
        it("should get a tool with populated brandId", async () => {
            const brand = await BrandService.createBrand(mockBrand1);

            const tool = await ToolService.createTool({
                ...mockTool1,
                brandId: String(brand._id),
            });

            const result = await ToolService.getToolById(String(tool._id));

            expect(result._id).toEqual(tool._id);
        });

        it("should throw NotFoundError if tool not found", async () => {
            const result = ToolService.getToolById(mockToolId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateToolById", () => {
        it("should update a tool", async () => {
            const tool = await ToolService.createTool(mockTool1);

            const result = await ToolService.updateToolById(
                String(tool._id),
                mockTool2
            );

            expect(result.name).toBe(mockTool2.name);

            expect(mockImageService.handleImageUpdate).toHaveBeenCalled();
        });

        it("should throw NotFoundError if tool to update not found ", async () => {
            const result = ToolService.updateToolById(mockToolId, mockTool2);

            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteToolById", () => {
        it("should delete a tool", async () => {
            const tool = await ToolService.createTool(mockTool1);

            const result = await ToolService.deleteToolById(String(tool._id));

            expect(result.name).toBe(mockTool1.name);

            expect(mockImageService.handleImageDeletion).toHaveBeenCalled();
        });

        it("should throw NotFoundError if tool to delete not found", async () => {
            const result = ToolService.deleteToolById(mockToolId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
