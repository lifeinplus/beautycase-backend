import mongoose, { Document, Schema } from "mongoose";

interface DesiredSkillData {
    bright?: boolean;
    delicate?: boolean;
    evening?: boolean;
    office?: boolean;
    filming?: boolean;
}

interface ProblemData {
    eyeshadowCrease?: boolean;
    eyeshadowMatch?: boolean;
    foundationPores?: boolean;
    foundationStay?: boolean;
    mascaraSmudge?: boolean;
    sculpting?: boolean;
}

interface ProcedureData {
    browCorrection?: boolean;
    lashExtensions?: boolean;
    lashLamination?: boolean;
    none?: boolean;
}

interface Questionnaire {
    age?: number;
    allergies?: string;
    budget?: string;
    brushes?: string;
    city?: string;
    currentSkills?: string;
    desiredSkills?: DesiredSkillData;
    instagram?: string;
    makeupBag: string;
    makeupBagPhoto?: string;
    makeupTime?: string;
    name: string;
    oilyShine?: string;
    peeling?: string;
    pores?: string;
    problems?: ProblemData;
    procedures?: ProcedureData;
    referral?: string;
    skinType?: string;
}

interface QuestionnaireDocument extends Questionnaire, Document {}

const QuestionnaireSchema: Schema = new Schema(
    {
        age: { type: Number },
        allergies: { type: String },
        budget: {
            type: String,
            enum: ["50", "50-100", "100"],
        },
        brushes: { type: String },
        city: { type: String },
        currentSkills: { type: String },
        desiredSkills: {
            bright: { type: Boolean },
            delicate: { type: Boolean },
            evening: { type: Boolean },
            office: { type: Boolean },
            filming: { type: Boolean },
        },
        instagram: { type: String },
        makeupBag: { type: String, required: true },
        makeupBagPhoto: { type: String },
        makeupTime: {
            type: String,
            enum: ["15", "15-30", "30-60"],
        },
        name: { type: String, required: true },
        oilyShine: { type: String },
        peeling: { type: String },
        pores: { type: String },
        problems: {
            eyeshadowCrease: { type: Boolean },
            eyeshadowMatch: { type: Boolean },
            foundationPores: { type: Boolean },
            foundationStay: { type: Boolean },
            mascaraSmudge: { type: Boolean },
            sculpting: { type: Boolean },
        },
        procedures: {
            browCorrection: { type: Boolean },
            lashExtensions: { type: Boolean },
            lashLamination: { type: Boolean },
            none: { type: Boolean },
        },
        referral: {
            type: String,
            enum: [
                "instagram",
                "youtube",
                "personal",
                "recommendation",
                "other",
            ],
        },
        skinType: { type: String },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<QuestionnaireDocument>(
    "Questionnaire",
    QuestionnaireSchema
);
