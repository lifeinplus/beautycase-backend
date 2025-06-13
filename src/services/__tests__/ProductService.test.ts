import { mockBrand1 } from "../../tests/mocks/brand";
import {
    mockProductId,
    mockProduct1,
    mockProduct2,
} from "../../tests/mocks/product";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";
import * as ImageService from "../ImageService";
import * as ProductService from "../ProductService";

jest.mock("../ImageService");

const mockImageService = ImageService as jest.Mocked<typeof ImageService>;

describe("ProductService", () => {
    describe("createProduct", () => {
        it("should create a product", async () => {
            const result = await ProductService.createProduct(mockProduct1);

            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockProduct1.name);

            expect(mockImageService.handleImageUpload).toHaveBeenCalled();
        });
    });

    describe("getAllProducts", () => {
        it("should get all products (imageUrl only)", async () => {
            await ProductService.createProduct(mockProduct1);
            await ProductService.createProduct(mockProduct2);

            const result = await ProductService.getAllProducts();

            expect(result).toHaveLength(2);
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

            expect(mockImageService.handleImageUpdate).toHaveBeenCalled();
        });

        it("should throw NotFoundError if product to update not found ", async () => {
            const result = ProductService.updateProductById(
                mockProductId,
                mockProduct2
            );

            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteProductById", () => {
        it("should delete a product", async () => {
            const product = await ProductService.createProduct(mockProduct1);

            const result = await ProductService.deleteProductById(
                String(product._id)
            );

            expect(result.name).toBe(mockProduct1.name);

            expect(mockImageService.handleImageDeletion).toHaveBeenCalled();
        });

        it("should throw NotFoundError if product to delete not found", async () => {
            const result = ProductService.deleteProductById(mockProductId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
