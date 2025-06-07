import { mockLesson1 } from "../../tests/mocks/lesson";
import LessonModel from "../LessonModel";

describe("LessonModel", () => {
    it("should exclude fields from JSON output", async () => {
        const result = await LessonModel.create(mockLesson1);
        const json = result.toJSON();
        expect(json).not.toHaveProperty("productIds");
    });

    it("should include virtuals in JSON output", async () => {
        const result = await LessonModel.create(mockLesson1);
        const json = result.toJSON();
        expect(json).toHaveProperty("products");
    });
});
