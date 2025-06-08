import type { Questionnaire } from "../../models/QuestionnaireModel";

export const mockQuestionnaireId = "682a378b09c4df2756fcece5";

export const mockQuestionnaire1: Questionnaire = {
    name: "Client 1",
    instagram: "@client1",
    city: "City 1",
    age: 30,
    makeupBag: "Brush",
};

export const mockQuestionnaire2: Questionnaire = {
    name: "Client 2",
    instagram: "@client2",
    city: "City 2",
    age: 28,
    makeupBag: "Foundation, mascara, lipstick, blush",
    makeupBagPhotoUrl: "https://example.com/makeup-bag.jpg",
};
