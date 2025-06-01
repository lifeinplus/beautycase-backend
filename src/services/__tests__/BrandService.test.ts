import BrandModel from "../../models/BrandModel";
import type { Brand } from "../../models/BrandModel";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";

describe("BrandService", () => {
    const mockId = "682a378b09c4df2756fcece5";
    const mockBrand1: Brand = { name: "Annbeauty" };
    const mockBrand2: Brand = { name: "ManlyPRO" };

    describe("createBrand", () => {
        it("should create a brand", async () => {
            const brand = await BrandService.createBrand(mockBrand1);
            expect(brand).toHaveProperty("_id");
            expect(brand.name).toBe(mockBrand1.name);
        });
    });

    describe("getAllBrands", () => {
        it("should get all brands sorted by name", async () => {
            await BrandService.createBrand(mockBrand1);
            await BrandService.createBrand(mockBrand2);

            const brands = await BrandService.getAllBrands();
            expect(brands.length).toBe(2);
            expect(brands[0].name).toBe(mockBrand1.name);
            expect(brands[1].name).toBe(mockBrand2.name);
        });

        it("should throw NotFoundError if no brands exist", async () => {
            const brandPromise = BrandService.getAllBrands();
            await expect(brandPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateBrandById", () => {
        it("should update brand by ID", async () => {
            const brand = await BrandService.createBrand(mockBrand1);

            const updated = await BrandService.updateBrandById(
                String(brand._id),
                mockBrand2
            );

            expect(updated.name).toBe(mockBrand2.name);
        });

        it("should throw NotFoundError if brand to update not found", async () => {
            const brandPromise = BrandService.updateBrandById(
                mockId,
                mockBrand2
            );
            await expect(brandPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteBrandById", () => {
        it("should delete brand by ID", async () => {
            const brand = await BrandService.createBrand(mockBrand1);

            const deleted = await BrandService.deleteBrandById(
                String(brand._id)
            );
            expect(deleted.name).toBe(mockBrand1.name);

            const found = await BrandModel.findById(brand._id);
            expect(found).toBeNull();
        });

        it("should throw NotFoundError if brand to delete not found", async () => {
            const brandPromise = BrandService.deleteBrandById(mockId);
            await expect(brandPromise).rejects.toThrow(NotFoundError);
        });
    });
});
