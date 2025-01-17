import mongoose, { Schema, Document } from "mongoose";

interface Store {
    name: string;
    link: string;
}

interface Tool {
    name: string;
    brandId: string;
    image: string;
    stores: Store[];
    number?: string;
    comment?: string;
}

interface ToolDocument extends Tool, Document {}

const StoreSchema = new Schema<Store>({
    name: { type: String, required: true },
    link: { type: String, required: true },
});

const ToolSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        image: { type: String, required: true },
        stores: { type: [StoreSchema], required: true },
        number: { type: String },
        comment: { type: String },
    },
    { versionKey: false }
);

export default mongoose.model<ToolDocument>("Tool", ToolSchema);
