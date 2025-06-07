import { mockMakeupBag1 } from "../../tests/mocks/makeupBag";
import MakeupBagModel from "../MakeupBagModel";

describe("MakeupBagModel", () => {
    it("should exclude fields from JSON output", async () => {
        const result = await MakeupBagModel.create(mockMakeupBag1);
        const json = result.toJSON();

        expect(json).not.toHaveProperty("categoryId");
        expect(json).not.toHaveProperty("clientId");
        expect(json).not.toHaveProperty("stageIds");
        expect(json).not.toHaveProperty("toolIds");
    });

    it("should include virtuals in JSON output", async () => {
        const result = await MakeupBagModel.create(mockMakeupBag1);
        const json = result.toJSON();

        expect(json).toHaveProperty("category");
        expect(json).toHaveProperty("client");
        expect(json).toHaveProperty("stages");
        expect(json).toHaveProperty("tools");
    });
});
