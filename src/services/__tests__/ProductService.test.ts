import { mockBrand1 } from "../../tests/mocks/brand";
import {
    mockProductId,
    mockProduct1,
    mockProduct2,
} from "../../tests/mocks/product";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";
import * as ProductService from "../ProductService";

jest.mock("cloudinary", () => ({
    v2: {
        config: jest.fn(),
        uploader: {
            destroy: jest.fn().mockResolvedValue({ result: "ok" }),
            explicit: jest.fn().mockResolvedValue({
                public_id: "products/renamed-id",
                secure_url: "https://cloudinary.com/renamed-image.jpg",
            }),
            rename: jest.fn().mockResolvedValue({
                public_id: "products/renamed-id",
                secure_url: "https://cloudinary.com/renamed-image.jpg",
            }),
        },
    },
}));

jest.mock("../../services/tempUploadsService", () => ({
    get: jest.fn(() => "temp-id"),
    remove: jest.fn(),
}));

describe("ProductService", () => {
    describe("createProduct", () => {
        it("should create a product", async () => {
            const product = await ProductService.createProduct(mockProduct1);

            expect(product).toHaveProperty("_id");
            expect(product.name).toBe(mockProduct1.name);
            expect(product.imageId).toBe("products/renamed-id");
        });
    });

    describe("getAllProducts", () => {
        it("should get all products (imageUrl only)", async () => {
            await ProductService.createProduct(mockProduct1);
            await ProductService.createProduct(mockProduct2);

            const products = await ProductService.getAllProducts();

            expect(products.length).toBe(2);
            expect(products[0]).toHaveProperty("imageUrl");
            expect(products[0].name).toBeUndefined();
        });

        it("should throw NotFoundError if no products found", async () => {
            const productPromise = ProductService.getAllProducts();
            await expect(productPromise).rejects.toThrow(NotFoundError);
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
            const productPromise = ProductService.getProductById(mockProductId);
            await expect(productPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateProductById", () => {
        it("should update a product", async () => {
            const product = await ProductService.createProduct(mockProduct1);

            const updated = await ProductService.updateProductById(
                String(product._id),
                mockProduct2
            );

            expect(updated.name).toBe(mockProduct2.name);
        });

        it("should throw NotFoundError if product to update not found ", async () => {
            const productPromise = ProductService.updateProductById(
                mockProductId,
                mockProduct2
            );
            await expect(productPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteProductById", () => {
        it("should delete a product", async () => {
            const product = await ProductService.createProduct({
                ...mockProduct1,
                imageId: "products/renamed-id",
            });

            const deleted = await ProductService.deleteProductById(
                String(product._id)
            );

            expect(deleted.name).toBe(mockProduct1.name);
        });

        it("should throw NotFoundError if product to delete not found", async () => {
            const productPromise =
                ProductService.deleteProductById(mockProductId);
            await expect(productPromise).rejects.toThrow(NotFoundError);
        });
    });
});
