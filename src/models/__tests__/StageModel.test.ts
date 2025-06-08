import { mockStage1 } from "../../tests/mocks/stage";
import StageModel from "../StageModel";

describe("StageModel", () => {
    it("should exclude fields from JSON output", async () => {
        const result = await StageModel.create(mockStage1);
        const json = result.toJSON();
        expect(json).not.toHaveProperty("productIds");
    });

    it("should include virtuals in JSON output", async () => {
        const result = await StageModel.create(mockStage1);
        const json = result.toJSON();
        expect(json).toHaveProperty("products");
    });
});
