import mongoose, { Document, Schema } from "mongoose";

interface Lesson {
    title: string;
    shortDescription: string;
    videoUrl: string;
    fullDescription: string;
    productIds?: string[];
}

interface LessonDocument extends Lesson, Document {}

const LessonSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        videoUrl: { type: String, required: true },
        fullDescription: { type: String, required: true },
        productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { versionKey: false }
);

export default mongoose.model<LessonDocument>("Lesson", LessonSchema);
