import { mockCategory1, mockCategory2 } from "../../tests/mocks/category";
import { NotFoundError } from "../../utils/AppErrors";
import * as CategoryService from "../CategoryService";

describe("CategoryService", () => {
    describe("createCategory", () => {
        it("should create a category", async () => {
            const category = await CategoryService.createCategory(
                mockCategory1
            );
            expect(category).toHaveProperty("_id");
            expect(category.name).toBe(mockCategory1.name);
        });
    });

    describe("getAllCategories", () => {
        it("should get all categories", async () => {
            await CategoryService.createCategory(mockCategory1);
            await CategoryService.createCategory(mockCategory2);

            const categories = await CategoryService.getAllCategories();
            expect(categories).toHaveLength(2);
            expect(categories[0].name).toBe(mockCategory1.name);
            expect(categories[1].name).toBe(mockCategory2.name);
        });

        it("should throw NotFoundError if no categories exist", async () => {
            await expect(CategoryService.getAllCategories()).rejects.toThrow(
                NotFoundError
            );
        });
    });
});
