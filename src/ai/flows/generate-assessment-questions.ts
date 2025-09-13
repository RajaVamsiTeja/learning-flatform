'use server';

/**
 * @fileOverview Automatically generates assessment questions (multiple choice, fill-in-the-blank) from uploaded documents.
 *
 * - generateAssessmentQuestions - A function that generates assessment questions from a document.
 * - GenerateAssessmentQuestionsInput - The input type for the generateAssessmentQuestions function.
 * - GenerateAssessmentQuestionsOutput - The return type for the generateAssessmentQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssessmentQuestionsInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to generate questions from.'),
});
export type GenerateAssessmentQuestionsInput = z.infer<
  typeof GenerateAssessmentQuestionsInputSchema
>;

const GenerateAssessmentQuestionsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('The generated assessment questions.'),
  progress: z.string().describe('Progress summary of assessment question generation.'),
});

export type GenerateAssessmentQuestionsOutput = z.infer<
  typeof GenerateAssessmentQuestionsOutputSchema
>;

export async function generateAssessmentQuestions(
  input: GenerateAssessmentQuestionsInput
): Promise<GenerateAssessmentQuestionsOutput> {
  return generateAssessmentQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAssessmentQuestionsPrompt',
  input: {schema: GenerateAssessmentQuestionsInputSchema},
  output: {schema: GenerateAssessmentQuestionsOutputSchema},
  prompt: `You are an expert in generating assessment questions from documents.
  Given the following document content, generate a variety of question types (multiple choice, fill-in-the-blank) to assess understanding of the material.
  Include at least 5 questions.
  Make the questions and answers based on the context of the document.
  Document Content: {{{documentContent}}}`,
});

const generateAssessmentQuestionsFlow = ai.defineFlow(
  {
    name: 'generateAssessmentQuestionsFlow',
    inputSchema: GenerateAssessmentQuestionsInputSchema,
    outputSchema: GenerateAssessmentQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // add a one-sentence summary of the progress
    output!.progress = 'Generated assessment questions from the uploaded document.';
    return output!;
  }
);
