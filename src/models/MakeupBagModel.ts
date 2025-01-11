import mongoose, { Document, Schema } from "mongoose";

interface MakeupBag {
    categoryId: string;
    clientId: string;
    stageIds?: string[];
    toolIds?: string[];
}

interface MakeupBagDocument extends MakeupBag, Document {}

const MakeupBagSchema: Schema = new Schema(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        clientId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        stageIds: [{ type: Schema.Types.ObjectId, ref: "Stage" }],
        toolIds: [{ type: Schema.Types.ObjectId, ref: "Tool" }],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<MakeupBagDocument>("MakeupBag", MakeupBagSchema);
