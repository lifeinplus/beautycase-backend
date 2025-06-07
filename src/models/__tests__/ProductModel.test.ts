import { mockProduct1 } from "../../tests/mocks/product";
import ProductModel from "../ProductModel";

describe("ProductModel", () => {
    it("should exclude fields from JSON output", async () => {
        const result = await ProductModel.create(mockProduct1);
        const json = result.toJSON();
        expect(json).not.toHaveProperty("brandId");
    });

    it("should include virtuals in JSON output", async () => {
        const result = await ProductModel.create(mockProduct1);
        const json = result.toJSON();
        expect(json).toHaveProperty("brand");
    });
});
