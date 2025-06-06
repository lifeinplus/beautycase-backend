import { mockCategory1, mockCategory2 } from "../../tests/mocks/category";
import { NotFoundError } from "../../utils/AppErrors";
import * as CategoryService from "../CategoryService";

describe("CategoryService", () => {
    describe("createCategory", () => {
        it("should create a category", async () => {
            const result = await CategoryService.createCategory(mockCategory1);
            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockCategory1.name);
        });
    });

    describe("getAllCategories", () => {
        it("should get all categories", async () => {
            await CategoryService.createCategory(mockCategory1);
            await CategoryService.createCategory(mockCategory2);

            const result = await CategoryService.getAllCategories();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe(mockCategory1.name);
            expect(result[1].name).toBe(mockCategory2.name);
        });

        it("should throw NotFoundError if no categories exist", async () => {
            const result = CategoryService.getAllCategories();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
