import type { Stage } from "../../models/StageModel";

export const mockStageId = "682a378b09c4df2756fcece5";

export const mockStage1: Stage = {
    title: "Base Makeup",
    subtitle: "Applying foundation and concealer",
    imageUrl: "https://example.com/image1.jpg",
    comment: "Test Comment 1",
    steps: ["Step 1.1", "Step 1.2", "Step 1.3"],
    productIds: ["682a378b09c4df2756fcece5"],
};

export const mockStage2: Stage = {
    title: "Eye Makeup",
    subtitle: "Applying eyeshadow and eyeliner",
    imageUrl: "https://example.com/image2.jpg",
    comment: "Test Comment 2",
    steps: ["Step 2.1", "Step 2.2", "Step 2.3"],
    productIds: ["682a378b09c4df2756fcece5"],
};
