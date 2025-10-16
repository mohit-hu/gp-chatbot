'use server';
/**
 * @fileOverview A speech-to-text (STT) flow using Genkit and Gemini.
 *
 * - stt - A function that handles the speech-to-text process.
 * - SttInput - The input type for the stt function.
 * - SttOutput - The return type for the stt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SttInputSchema = z.object({
  audio: z
    .string()
    .describe(
      "A base64-encoded audio string, with data URI prefix, e.g., 'data:audio/webm;codecs=opus;base64,...'"
    ),
});
export type SttInput = z.infer<typeof SttInputSchema>;

const SttOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type SttOutput = z.infer<typeof SttOutputSchema>;

export async function stt(input: SttInput): Promise<SttOutput> {
  return sttFlow(input);
}

const sttFlow = ai.defineFlow(
  {
    name: 'sttFlow',
    inputSchema: SttInputSchema,
    outputSchema: SttOutputSchema,
  },
  async input => {
    const {text} = await ai.generate({
      prompt: [
        {
          media: {
            url: input.audio,
          },
        },
        {text: 'Transcribe the audio.'},
      ],
    });

    return {text};
  }
);
