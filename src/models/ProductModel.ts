import mongoose, { Schema, Document } from "mongoose";

import { StoreLink, StoreLinkSchema } from "./shared";

interface Product {
    brandId: string;
    name: string;
    image: string;
    shade?: string;
    comment: string;
    storeLinks: StoreLink[];
}

interface ProductDocument extends Product, Document {}

const ProductSchema = new Schema(
    {
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        shade: { type: String },
        comment: { type: String, required: true },
        storeLinks: { type: [StoreLinkSchema], required: true },
    },
    { versionKey: false }
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
