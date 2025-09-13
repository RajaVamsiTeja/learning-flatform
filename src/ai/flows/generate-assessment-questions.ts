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
    .array(
      z.object({
        id: z.string().describe('A unique identifier for the question.'),
        question: z.string().describe('The question text.'),
        options: z.array(z.string()).describe('A list of possible answers for multiple-choice questions.'),
      })
    )
    .describe('The generated assessment questions.'),
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
  Given the following document content, generate a variety of multiple choice questions to assess understanding of the material.
  Include at least 5 questions.
  Make the questions and answers based on the context of the document.
  Ensure each question has a unique ID, the question text, and a list of options.

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
    return output!;
  }
);
