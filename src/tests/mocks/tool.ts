import type { Tool } from "../../models/ToolModel";

export const mockToolId = "682a378b09c4df2756fcece5";

export const mockTool1: Tool = {
    brandId: "682a378b09c4df2756fcece5",
    name: "Tool 1",
    imageUrl: "https://example.com/1.webp",
    comment: "Perfect",
    storeLinks: [
        {
            name: "ManlyPRO",
            link: "https://example.com/111",
        },
    ],
};

export const mockTool2: Tool = {
    brandId: "682a378b09c4df2756fcece5",
    name: "Tool 2",
    imageUrl: "https://example.com/2.webp",
    comment: "Perfect",
    storeLinks: [],
};

export const mockTools: Tool[] = [mockTool1, mockTool2];
