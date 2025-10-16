'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering questions based on content from a URL.
 *
 * - answerFromLink - A function that handles the question answering process.
 * - AnswerFromLinkInput - The input type for the answerFromLink function.
 * - AnswerFromLinkOutput - The return type for the answerFromLink function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerFromLinkInputSchema = z.object({
  query: z.string().describe('The user\'s question.'),
  url: z.string().url().describe('The URL to fetch content from.'),
});
export type AnswerFromLinkInput = z.infer<typeof AnswerFromLinkInputSchema>;

const AnswerFromLinkOutputSchema = z.object({
  answer: z.string().describe('The answer to the query based on the URL content.'),
});
export type AnswerFromLinkOutput = z.infer<typeof AnswerFromLinkOutputSchema>;

// Function to fetch content from a URL
const fetchWebpageContent = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // For simplicity, we'll just get the text.
    // In a real app, you might want to parse the HTML and extract the main content.
    const text = await response.text();
    // Basic HTML tag stripping
    return text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  } catch (error: any) {
    console.error('Error fetching webpage content:', error);
    return `Failed to fetch content from ${url}. Error: ${error.message}`;
  }
};

// Tool to fetch content from a URL
const getWebpageContent = ai.defineTool(
  {
    name: 'getWebpageContent',
    description: 'Fetches the text content of a given webpage.',
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    return fetchWebpageContent(url);
  }
);


export async function answerFromLink(input: AnswerFromLinkInput): Promise<AnswerFromLinkOutput> {
  return answerFromLinkFlow(input);
}

const answerFromLinkPrompt = ai.definePrompt({
    name: 'answerFromLinkPrompt',
    system: `You are a helpful assistant. Answer the user's query based on the provided context from the webpage. If the context doesn't contain the answer, say that you couldn't find the information in the provided document.`,
    tools: [getWebpageContent]
});


const answerFromLinkFlow = ai.defineFlow(
  {
    name: 'answerFromLinkFlow',
    inputSchema: AnswerFromLinkInputSchema,
    outputSchema: AnswerFromLinkOutputSchema,
  },
  async (input) => {
    const content = await fetchWebpageContent(input.url);
    const llmResponse = await answerFromLinkPrompt([
        {role: 'user', content: `Context from ${input.url}: ${content}`},
        {role: 'user', content: `Based on the context above, please answer my question: ${input.query}`}
    ]);

    return { answer: llmResponse.text };
  }
);
