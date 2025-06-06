import mongoose, { Schema, Document } from "mongoose";

import StoreLinkSchema from "./shared/StoreLinkSchema";
import type { StoreLink } from "./shared/StoreLinkSchema";

export interface Product {
    brandId: string;
    name: string;
    imageId?: string;
    imageUrl: string;
    shade?: string;
    comment: string;
    storeLinks: StoreLink[];
}

export interface ProductDocument extends Product, Document {}

const ProductSchema = new Schema(
    {
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        name: { type: String, required: true },
        imageId: { type: String },
        imageUrl: { type: String, required: true },
        shade: { type: String },
        comment: { type: String, required: true },
        storeLinks: { type: [StoreLinkSchema], required: true },
    },
    {
        id: false,
        toJSON: {
            transform: (_, ret) => {
                delete ret.brandId;
                return ret;
            },
            virtuals: true,
        },
        versionKey: false,
        virtuals: {
            brand: {
                get() {
                    return this.brandId;
                },
            },
        },
    }
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
