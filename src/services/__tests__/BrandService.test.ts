import { mockBrand1, mockBrand2, mockBrandId } from "../../tests/mocks/brand";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";

describe("BrandService", () => {
    describe("createBrand", () => {
        it("should create a brand", async () => {
            const result = await BrandService.createBrand(mockBrand1);
            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockBrand1.name);
        });
    });

    describe("getAllBrands", () => {
        it("should get all brands", async () => {
            await BrandService.createBrand(mockBrand1);
            await BrandService.createBrand(mockBrand2);

            const result = await BrandService.getAllBrands();
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe(mockBrand1.name);
            expect(result[1].name).toBe(mockBrand2.name);
        });

        it("should throw NotFoundError if no brands exist", async () => {
            const result = BrandService.getAllBrands();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateBrandById", () => {
        it("should update a brand", async () => {
            const brand = await BrandService.createBrand(mockBrand1);

            const result = await BrandService.updateBrandById(
                String(brand._id),
                mockBrand2
            );

            expect(result.name).toBe(mockBrand2.name);
        });

        it("should throw NotFoundError if brand to update not found", async () => {
            const result = BrandService.updateBrandById(
                mockBrandId,
                mockBrand2
            );

            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteBrandById", () => {
        it("should delete a brand", async () => {
            const brand = await BrandService.createBrand(mockBrand1);

            const result = await BrandService.deleteBrandById(
                String(brand._id)
            );

            expect(result.name).toBe(mockBrand1.name);
        });

        it("should throw NotFoundError if brand to delete not found", async () => {
            const result = BrandService.deleteBrandById(mockBrandId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
