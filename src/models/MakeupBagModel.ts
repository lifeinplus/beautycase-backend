import mongoose, { Document, Schema } from "mongoose";

interface MakeupBag {
    clientId: string;
    brandIds?: string[];
    stageIds?: string[];
}

interface MakeupBagDocument extends MakeupBag, Document {}

const MakeupBagSchema: Schema = new Schema(
    {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        brandIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" }],
        stageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stage" }],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<MakeupBagDocument>("MakeupBag", MakeupBagSchema);
