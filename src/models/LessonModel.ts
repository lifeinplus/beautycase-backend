import mongoose, { Document, Schema } from "mongoose";

interface Lesson {
    title: string;
    shortDescription: string;
    thumbnailUrl: string;
    videoUrl: string;
    fullDescription: string;
    materials?: string[];
}

interface LessonDocument extends Lesson, Document {}

const LessonSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        videoUrl: { type: String, required: true },
        fullDescription: { type: String, required: true },
        materials: { type: [String] },
    },
    { versionKey: false }
);

export default mongoose.model<LessonDocument>("Lesson", LessonSchema);
