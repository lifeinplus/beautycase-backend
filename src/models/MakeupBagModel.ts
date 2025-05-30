import mongoose, { Document, Schema } from "mongoose";

export interface MakeupBag {
    categoryId: string;
    clientId: string;
    stageIds: string[];
    toolIds: string[];
}

export interface MakeupBagDocument extends MakeupBag, Document {}

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
        stageIds: {
            type: [Schema.Types.ObjectId],
            ref: "Stage",
            required: true,
        },
        toolIds: {
            type: [Schema.Types.ObjectId],
            ref: "Tool",
            required: true,
        },
    },
    {
        id: false,
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                delete ret.categoryId;
                delete ret.clientId;
                delete ret.stageIds;
                delete ret.toolIds;
                return ret;
            },
            virtuals: true,
        },
        versionKey: false,
        virtuals: {
            category: {
                get() {
                    return this.categoryId;
                },
            },
            client: {
                get() {
                    return this.clientId;
                },
            },
            stages: {
                get() {
                    return this.stageIds;
                },
            },
            tools: {
                get() {
                    return this.toolIds;
                },
            },
        },
    }
);

export default mongoose.model<MakeupBagDocument>("MakeupBag", MakeupBagSchema);
