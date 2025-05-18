import mongoose, { Schema, Document } from "mongoose";

import StoreLinkSchema from "./shared/StoreLinkSchema";
import type { StoreLink } from "./shared/StoreLinkSchema";

interface Tool {
    brandId: string;
    name: string;
    imageId?: string;
    imageUrl: string;
    number?: string;
    comment: string;
    storeLinks: StoreLink[];
}

interface ToolDocument extends Tool, Document {}

const ToolSchema: Schema = new Schema(
    {
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        name: { type: String, required: true },
        imageId: { type: String },
        imageUrl: { type: String, required: true },
        number: { type: String },
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

export default mongoose.model<ToolDocument>("Tool", ToolSchema);
