'use server';

/**
 * @fileOverview Extracts a location from a user query using GenAI.
 *
 * - extractLocationFromQuery - A function that extracts the location from the query.
 * - ExtractLocationFromQueryInput - The input type for the extractLocationFromQuery function.
 * - ExtractLocationFromQueryOutput - The return type for the extractLocationFromQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractLocationFromQueryInputSchema = z.object({
  query: z
    .string()
    .describe('The query to extract the location from, e.g. Where is the mechanical block?'),
});
export type ExtractLocationFromQueryInput = z.infer<
  typeof ExtractLocationFromQueryInputSchema
>;

const ExtractLocationFromQueryOutputSchema = z.object({
  location: z
    .string()
    .describe(
      'The location extracted from the query. If no location is found, return an empty string.'
    ),
});
export type ExtractLocationFromQueryOutput = z.infer<
  typeof ExtractLocationFromQueryOutputSchema
>;

export async function extractLocationFromQuery(
  input: ExtractLocationFromQueryInput
): Promise<ExtractLocationFromQueryOutput> {
  return extractLocationFromQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractLocationFromQueryPrompt',
  input: {schema: ExtractLocationFromQueryInputSchema},
  output: {schema: ExtractLocationFromQueryOutputSchema},
  prompt: `You are a helpful assistant that extracts the location from a user query.

  If the query does not contain a location, return an empty string.

  For example:
  Query: Where is the mechanical block?
  Location: mechanical block

  Query: Who is the principal?
  Location: ''

  Query: {{{query}}}
  Location: `,
});

const extractLocationFromQueryFlow = ai.defineFlow(
  {
    name: 'extractLocationFromQueryFlow',
    inputSchema: ExtractLocationFromQueryInputSchema,
    outputSchema: ExtractLocationFromQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
