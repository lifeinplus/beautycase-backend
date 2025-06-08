import type { Product } from "../../models/ProductModel";

export const mockProductId = "682a378b09c4df2756fcece5";

export const mockProduct1: Product = {
    brandId: "682a378b09c4df2756fcece5",
    name: "Product 1",
    imageUrl: "https://image.url/product1.png",
    comment: "Comment 1",
    storeLinks: [
        {
            name: "Store 1",
            link: "https://store1.com/foundation",
        },
    ],
};

export const mockProduct2: Product = {
    brandId: mockProductId,
    name: "Product 2",
    imageUrl: "https://image.url/product2.png",
    comment: "Comment 2",
    storeLinks: [],
};
