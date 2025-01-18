import mongoose, { Schema, Document } from "mongoose";

import { StoreLink, StoreLinkSchema } from "./shared";

interface Product {
    name: string;
    brandId: string;
    image: string;
    shade: string;
    comment: string;
    storeLinks: StoreLink[];
}

interface ProductDocument extends Product, Document {}

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        image: { type: String, required: true },
        shade: { type: String, required: true },
        comment: { type: String, required: true },
        storeLinks: { type: [StoreLinkSchema], required: true },
    },
    { versionKey: false }
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
