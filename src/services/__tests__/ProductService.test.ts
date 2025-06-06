import { v2 as cloudinary } from "cloudinary";

import { mockBrand1 } from "../../tests/mocks/brand";
import { mockErrorCloudinary } from "../../tests/mocks/error";
import {
    mockProductId,
    mockProduct1,
    mockProduct2,
} from "../../tests/mocks/product";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";
import * as ProductService from "../ProductService";
import tempUploadsService from "../tempUploadsService";

jest.mock("cloudinary");
jest.mock("../tempUploadsService");

const mockCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

const mockTempUploadsService = tempUploadsService as jest.Mocked<
    typeof tempUploadsService
>;

describe("ProductService", () => {
    const mockPublicId = "test_public_id";

    const renamedResponse = {
        public_id: "products/renamed-id",
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

    describe("createProduct", () => {
        it("should create a product", async () => {
            const result = await ProductService.createProduct(mockProduct1);

            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockProduct1.name);
            expect(result.imageId).toBe(renamedResponse.public_id);
            expect(result.imageUrl).toBe(renamedResponse.secure_url);

            expect(mockCloudinary.uploader.explicit).toHaveBeenCalledTimes(1);
            expect(mockCloudinary.uploader.rename).toHaveBeenCalledTimes(1);

            expect(mockTempUploadsService.remove).toHaveBeenCalledWith(
                mockProduct1.imageUrl
            );
        });

        it("should skip image upload if no publicId found", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);

            const result = await ProductService.createProduct(mockProduct2);

            expect(result.imageId).toBeUndefined();
            expect(result.imageUrl).toBe(mockProduct2.imageUrl);

            expect(mockCloudinary.uploader.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.uploader.rename).not.toHaveBeenCalled();

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
        });

        it("should handle cloudinary upload errors", async () => {
            mockCloudinary.uploader.explicit = jest
                .fn()
                .mockRejectedValue(mockErrorCloudinary);

            const result = ProductService.createProduct(mockProduct2);

            await expect(result).rejects.toThrow(mockErrorCloudinary.message);

            expect(mockTempUploadsService.remove).not.toHaveBeenCalled();
        });
    });

    describe("getAllProducts", () => {
        it("should get all products (imageUrl only)", async () => {
            await ProductService.createProduct(mockProduct1);
            await ProductService.createProduct(mockProduct2);

            const result = await ProductService.getAllProducts();

            expect(result.length).toBe(2);
            expect(result[0]).toHaveProperty("imageUrl");
            expect(result[0].name).toBeUndefined();
        });

        it("should throw NotFoundError if no products found", async () => {
            const result = ProductService.getAllProducts();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getProductById", () => {
        it("should get a product with populated brandId", async () => {
            const brand = await BrandService.createBrand(mockBrand1);

            const product = await ProductService.createProduct({
                ...mockProduct1,
                brandId: String(brand._id),
            });

            const result = await ProductService.getProductById(
                String(product._id)
            );

            expect(result._id).toEqual(product._id);
        });

        it("should throw NotFoundError if product not found", async () => {
            const result = ProductService.getProductById(mockProductId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateProductById", () => {
        it("should update a product", async () => {
            const product = await ProductService.createProduct(mockProduct1);

            const result = await ProductService.updateProductById(
                String(product._id),
                mockProduct2
            );

            expect(result.name).toBe(mockProduct2.name);
        });

        it("should throw NotFoundError if product to update not found ", async () => {
            const result = ProductService.updateProductById(
                mockProductId,
                mockProduct2
            );

            await expect(result).rejects.toThrow(NotFoundError);
        });

        it("should handle cloudinary update errors", async () => {
            const product = await ProductService.createProduct(mockProduct1);

            mockCloudinary.uploader.rename = jest
                .fn()
                .mockRejectedValue(mockErrorCloudinary);

            const result = ProductService.updateProductById(
                String(product._id),
                mockProduct2
            );

            await expect(result).rejects.toThrow(mockErrorCloudinary.message);
        });
    });

    describe("deleteProductById", () => {
        it("should delete a product", async () => {
            const product = await ProductService.createProduct({
                ...mockProduct1,
                imageId: "products/renamed-id",
            });

            const result = await ProductService.deleteProductById(
                String(product._id)
            );

            expect(result.name).toBe(mockProduct1.name);
        });

        it("should throw NotFoundError if product to delete not found", async () => {
            const result = ProductService.deleteProductById(mockProductId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
