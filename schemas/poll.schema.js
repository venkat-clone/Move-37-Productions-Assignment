import { z } from "zod";

export const pollSchema = z.object({
    question: z.string().min(5, "Question is required"),
    isPublished: z.boolean().optional(),
    options: z
        .array(z.string().min(1, "Option text is required"))
        .min(2, "At least two poll options are required")
        .transform((options) => options.map((text) => ({ text }))),
});

