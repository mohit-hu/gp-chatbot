'use server';
/**
 * @fileOverview A text-to-speech (TTS) flow using Genkit.
 *
 * - tts - A function that handles the text-to-speech process.
 * - TtsInput - The input type for the tts function.
 * - TtsOutput - The return type for the tts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/google-genai';

const TtsInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type TtsInput = z.infer<typeof TtsInputSchema>;

const TtsOutputSchema = z.object({
  audio: z
    .string()
    .describe(
      "A base64-encoded audio string with data URI prefix, e.g., 'data:audio/wav;base64,...'"
    ),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

export async function tts(input: TtsInput): Promise<TtsOutput> {
  return ttsFlow(input);
}

const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: TtsInputSchema,
    outputSchema: TtsOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audio: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
