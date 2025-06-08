import { v2 as cloudinary } from "cloudinary";

import { mockBrand1 } from "../../tests/mocks/brand";
import { mockErrorCloudinary } from "../../tests/mocks/error";
import { mockToolId, mockTool1, mockTool2 } from "../../tests/mocks/tool";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";
import * as ToolService from "../ToolService";
import tempUploadsService from "../tempUploadsService";

jest.mock("cloudinary");
jest.mock("../tempUploadsService");

const mockCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

const mockTempUploadsService = tempUploadsService as jest.Mocked<
    typeof tempUploadsService
>;

describe("ToolService", () => {
    const mockPublicId = "test_public_id";

    const mockCloudinaryResponse = {
        public_id: "tools/renamed-id",
        secure_url: "https://cloudinary.com/renamed-image.jpg",
    };

    beforeEach(() => {
        mockCloudinary.uploader.explicit = jest
            .fn()
            .mockResolvedValue(mockCloudinaryResponse);

        mockCloudinary.uploader.rename = jest
            .fn()
            .mockResolvedValue(mockCloudinaryResponse);

        mockTempUploadsService.get.mockReturnValue(mockPublicId);
    });

    describe("createTool", () => {
        it("should create a tool", async () => {
            const result = await ToolService.createTool(mockTool1);

            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockTool1.name);
            expect(result.imageId).toBe(mockCloudinaryResponse.public_id);
            expect(result.imageUrl).toBe(mockCloudinaryResponse.secure_url);

            expect(mockCloudinary.uploader.explicit).toHaveBeenCalledTimes(1);
            expect(mockCloudinary.uploader.rename).toHaveBeenCalledTimes(1);

            expect(mockTempUploadsService.remove).toHaveBeenCalledWith(
                mockTool1.imageUrl
            );
        });

        it("should skip image upload if no publicId found", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);

            const result = await ToolService.createTool(mockTool2);

            expect(result.imageId).toBeUndefined();
            expect(result.imageUrl).toBe(mockTool2.imageUrl);

            expect(mockCloudinary.uploader.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.uploader.rename).not.toHaveBeenCalled();

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
        });

        it("should handle cloudinary upload errors", async () => {
            mockCloudinary.uploader.explicit = jest
                .fn()
                .mockRejectedValue(mockErrorCloudinary);

            const result = ToolService.createTool(mockTool2);

            await expect(result).rejects.toThrow(mockErrorCloudinary.message);

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
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
        });

        it("should throw NotFoundError if tool to update not found ", async () => {
            const result = ToolService.updateToolById(mockToolId, mockTool2);

            await expect(result).rejects.toThrow(NotFoundError);
        });

        it("should handle cloudinary update errors", async () => {
            const tool = await ToolService.createTool(mockTool1);

            mockCloudinary.uploader.rename = jest
                .fn()
                .mockRejectedValue(mockErrorCloudinary);

            const result = ToolService.updateToolById(
                String(tool._id),
                mockTool2
            );

            await expect(result).rejects.toThrow(mockErrorCloudinary.message);
        });
    });

    describe("deleteToolById", () => {
        it("should delete a tool", async () => {
            const tool = await ToolService.createTool({
                ...mockTool1,
                imageId: "tools/renamed-id",
            });

            const result = await ToolService.deleteToolById(String(tool._id));

            expect(result.name).toBe(mockTool1.name);
        });

        it("should throw NotFoundError if tool to delete not found", async () => {
            const result = ToolService.deleteToolById(mockToolId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
