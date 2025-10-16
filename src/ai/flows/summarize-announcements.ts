'use server';

/**
 * @fileOverview This file defines a Genkit flow to summarize the latest announcements.
 *
 * - summarizeAnnouncements - A function that summarizes the latest announcements.
 * - SummarizeAnnouncementsInput - The input type for the summarizeAnnouncements function.
 * - SummarizeAnnouncementsOutput - The return type for the summarizeAnnouncements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAnnouncementsInputSchema = z.object({
  announcements: z
    .array(
      z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        link: z.string().optional(),
      })
    )
    .describe('An array of announcement objects.'),
});
export type SummarizeAnnouncementsInput = z.infer<
  typeof SummarizeAnnouncementsInputSchema
>;

const SummarizeAnnouncementsOutputSchema = z.object({
  summary: z.string().describe('A summary of the latest announcements.'),
});
export type SummarizeAnnouncementsOutput = z.infer<
  typeof SummarizeAnnouncementsOutputSchema
>;

export async function summarizeAnnouncements(
  input: SummarizeAnnouncementsInput
): Promise<SummarizeAnnouncementsOutput> {
  return summarizeAnnouncementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAnnouncementsPrompt',
  input: {schema: SummarizeAnnouncementsInputSchema},
  output: {schema: SummarizeAnnouncementsOutputSchema},
  prompt: `You are a helpful assistant that summarizes announcements for students at GP Srinagar.

Announcements:
{{#each announcements}}
Title: {{title}}
Date: {{date}}
Description: {{description}}
{{#if link}}Link: {{link}}{{/if}}
\n{{/each}}

Please provide a concise summary of these announcements.`,
});

const summarizeAnnouncementsFlow = ai.defineFlow(
  {
    name: 'summarizeAnnouncementsFlow',
    inputSchema: SummarizeAnnouncementsInputSchema,
    outputSchema: SummarizeAnnouncementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
