import { mockTool1 } from "../../tests/mocks/tool";
import ToolModel from "../ToolModel";

describe("ToolModel", () => {
    it("should exclude fields from JSON output", async () => {
        const result = await ToolModel.create(mockTool1);
        const json = result.toJSON();
        expect(json).not.toHaveProperty("brandId");
    });

    it("should include virtuals in JSON output", async () => {
        const result = await ToolModel.create(mockTool1);
        const json = result.toJSON();
        expect(json).toHaveProperty("brand");
    });
});
