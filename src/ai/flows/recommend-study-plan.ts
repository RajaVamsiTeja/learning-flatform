'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending study plans based on user performance.
 *
 * - recommendStudyPlan - A function that takes user performance data and recommends study materials.
 * - RecommendStudyPlanInput - The input type for the recommendStudyPlan function.
 * - RecommendStudyPlanOutput - The return type for the recommendStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendStudyPlanInputSchema = z.object({
  assessmentResults: z
    .array(z.object({
      questionId: z.string(),
      isCorrect: z.boolean(),
      topic: z.string(),
    }))
    .describe('An array of assessment results, including question ID, correctness, and topic.'),
  uploadedDocuments: z
    .array(z.object({
      documentId: z.string(),
      title: z.string(),
      content: z.string(),
      topic: z.string().optional(),
    }))
    .describe('An array of uploaded documents with their content and topic.'),
  sharedDocuments: z
    .array(z.object({
      documentId: z.string(),
      title: z.string(),
      content: z.string(),
      topic: z.string().optional(),
      difficulty: z.string().optional(),
    }))
    .optional()
    .describe('An array of shared documents with their content, topic, and difficulty.'),
});
export type RecommendStudyPlanInput = z.infer<typeof RecommendStudyPlanInputSchema>;

const RecommendStudyPlanOutputSchema = z.object({
  recommendedMaterials: z
    .array(z.object({
      documentId: z.string(),
      title: z.string(),
      topic: z.string(),
      sections: z.array(z.string()).describe('Relevant sections from the document.'),
      reason: z.string().describe('Reason for recommending this material.'),
    }))
    .describe('An array of recommended study materials.'),
});
export type RecommendStudyPlanOutput = z.infer<typeof RecommendStudyPlanOutputSchema>;

export async function recommendStudyPlan(input: RecommendStudyPlanInput): Promise<RecommendStudyPlanOutput> {
  return recommendStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendStudyPlanPrompt',
  input: {schema: RecommendStudyPlanInputSchema},
  output: {schema: RecommendStudyPlanOutputSchema},
  prompt: `You are an AI study plan generator. You will generate a study plan based on the user's assessment results and available documents.

  Assessment Results:
  {{#each assessmentResults}}
  - Question ID: {{this.questionId}}, Correct: {{this.isCorrect}}, Topic: {{this.topic}}
  {{/each}}

  Uploaded Documents:
  {{#each uploadedDocuments}}
  - Document ID: {{this.documentId}}, Title: {{this.title}}, Topic: {{this.topic}}
  {{/each}}

  Shared Documents:
  {{#each sharedDocuments}}
  - Document ID: {{this.documentId}}, Title: {{this.title}}, Topic: {{this.topic}}, Difficulty: {{this.difficulty}}
  {{/each}}

  Based on the assessment results, recommend specific study materials from the uploaded documents and shared documents (if available) to address the user's weaknesses. Include relevant sections from each document and a reason for the recommendation.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const recommendStudyPlanFlow = ai.defineFlow(
  {
    name: 'recommendStudyPlanFlow',
    inputSchema: RecommendStudyPlanInputSchema,
    outputSchema: RecommendStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
