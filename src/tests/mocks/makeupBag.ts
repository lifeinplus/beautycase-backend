import type { Brand } from "../../models/BrandModel";
import type { Category } from "../../models/CategoryModel";
import type { MakeupBag } from "../../models/MakeupBagModel";
import type { Product } from "../../models/ProductModel";
import type { Stage } from "../../models/StageModel";
import type { Tool } from "../../models/ToolModel";
import type { User } from "../../models/UserModel";

export const mockMakeupBagId = "682a378b09c4df2756fcece5";

export const mockBrand: Brand = {
    name: "Brand 1",
};

export const mockCategory: Category = {
    name: "Category 1",
    type: "test_type",
};

export const mockProduct: Product = {
    brandId: "682a378b09c4df2756fcece5",
    name: "Product 1",
    imageUrl: "https://example.com/foundation.jpg",
    shade: "Natural Beige",
    comment: "Long-lasting, natural finish",
    storeLinks: [
        {
            name: "Store 1",
            link: "https://store1.com/foundation",
        },
    ],
};

export const mockStage: Stage = {
    title: "Base Makeup",
    subtitle: "Applying foundation and concealer",
    imageUrl: "https://example.com/image1.jpg",
    comment: "Test Comment 1",
    steps: ["Step 1.1", "Step 1.2", "Step 1.3"],
    productIds: [],
};

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

export const mockUser: User = {
    password: "securepassword",
    refreshTokens: [],
    role: "admin",
    username: "Admin",
};

export const mockMakeupBag1: MakeupBag = {
    categoryId: "682a378b09c4df2756fcece5",
    clientId: "683cbe0796c7f5d3d62101e0",
    stageIds: ["682a378b09c4df2756fcece5"],
    toolIds: ["683cbe0796c7f5d3d62101e0"],
};

export const mockMakeupBag2: MakeupBag = {
    categoryId: "683cbe0796c7f5d3d62101e0",
    clientId: "682a378b09c4df2756fcece5",
    stageIds: ["683cbe0796c7f5d3d62101e0"],
    toolIds: ["682a378b09c4df2756fcece5"],
};
