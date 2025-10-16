'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering student queries about the campus.
 *
 * The flow uses a language model to understand the query and provide a relevant response.
 *
 * - answerStudentQueries - A function that handles the student query answering process.
 * - AnswerStudentQueriesInput - The input type for the answerStudentQueries function.
 * - AnswerStudentQueriesOutput - The return type for the answerStudentQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extractLocationFromQuery } from './extract-location-from-query';


const AnswerStudentQueriesInputSchema = z.object({
  query: z.string().describe('The student query about the campus.'),
});
export type AnswerStudentQueriesInput = z.infer<typeof AnswerStudentQueriesInputSchema>;

const AnswerStudentQueriesOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the student query.'),
  mapLink: z.string().optional().describe('A Google Maps link, if the query is location-related.'),
});
export type AnswerStudentQueriesOutput = z.infer<typeof AnswerStudentQueriesOutputSchema>;

export async function answerStudentQueries(input: AnswerStudentQueriesInput): Promise<AnswerStudentQueriesOutput> {
  return answerStudentQueriesFlow(input);
}

const answerStudentQueriesPrompt = ai.definePrompt({
  name: 'answerStudentQueriesPrompt',
  input: {schema: AnswerStudentQueriesInputSchema},
  output: {schema: z.object({
    response: z.string().describe('The chatbot response to the student query.'),
  })},
  system: `You are a helpful chatbot for Government Polytechnic College, Srinagar Garhwal.

Your goal is to provide accurate and concise information to students. When asked for a specific person's name, like the principal or a head of department, you MUST search online and provide the name if it is available. Do not tell the user to search for it themselves.

For any queries about locations on campus, you MUST use the knowledge base provided below.
For ALL OTHER queries, you should search online to find the most relevant and up-to-date information about the college.

When answering, be friendly and helpful.

KNOWLEDGE BASE FOR CAMPUS LOCATIONS:
- The Admin Block is centrally located.
- The Computer Science and IT block is near the Admin block.
- The Mechanical Block and Workshop are on the east side of the campus.
- The Library is located in a separate building near the Girls Hostel.
- The Canteen is near the main entrance.
- The Principal's Quarter and other residential buildings are on the west side.`,
  prompt: `{{query}}`,
});

const answerStudentQueriesFlow = ai.defineFlow(
  {
    name: 'answerStudentQueriesFlow',
    inputSchema: AnswerStudentQueriesInputSchema,
    outputSchema: AnswerStudentQueriesOutputSchema,
  },
  async input => {
    const { output } = await answerStudentQueriesPrompt(input);
    const { location } = await extractLocationFromQuery({ query: input.query });

    let mapLink: string | undefined;
    if (location) {
        mapLink = `https://www.google.com/maps?q=GP+Srinagar+${encodeURIComponent(location)}`;
    }

    return { response: output!.response, mapLink };
  }
);
