import mongoose, { Document, Schema } from "mongoose";

export interface Lesson {
    title: string;
    shortDescription: string;
    videoUrl: string;
    fullDescription: string;
    productIds: string[];
    clientIds?: string[];
}

export interface LessonDocument extends Lesson, Document {}

const LessonSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        videoUrl: { type: String, required: true },
        fullDescription: { type: String, required: true },
        productIds: {
            type: [Schema.Types.ObjectId],
            ref: "Product",
            required: true,
        },
        clientIds: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
    },
    {
        id: false,
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                delete ret.productIds;
                return ret;
            },
            virtuals: true,
        },
        versionKey: false,
        virtuals: {
            products: {
                get() {
                    return this.productIds;
                },
            },
        },
    }
);

export default mongoose.model<LessonDocument>("Lesson", LessonSchema);
