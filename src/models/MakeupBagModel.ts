import mongoose, { Document, Schema } from "mongoose";

interface MakeupBag {
    clientId: string;
    stageIds?: string[];
    toolIds?: string[];
}

interface MakeupBagDocument extends MakeupBag, Document {}

const MakeupBagSchema: Schema = new Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        stageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stage" }],
        toolIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tool" }],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<MakeupBagDocument>("MakeupBag", MakeupBagSchema);
