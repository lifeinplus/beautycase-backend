import mongoose, { Schema, Document } from "mongoose";

import { StoreLink, StoreLinkSchema } from "./shared";

interface Tool {
    name: string;
    brandId: string;
    image: string;
    number?: string;
    comment?: string;
    storeLinks: StoreLink[];
}

interface ToolDocument extends Tool, Document {}

const ToolSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        image: { type: String, required: true },
        number: { type: String },
        comment: { type: String },
        storeLinks: { type: [StoreLinkSchema], required: true },
    },
    { versionKey: false }
);

export default mongoose.model<ToolDocument>("Tool", ToolSchema);
