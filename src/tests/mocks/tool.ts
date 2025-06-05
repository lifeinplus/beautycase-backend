import type { Tool } from "../../models/ToolModel";

export const mockTool: Tool = {
    brandId: "brand1",
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
