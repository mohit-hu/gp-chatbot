'use server';

import { answerStudentQueries } from '@/ai/flows/answer-student-queries';
import { summarizeAnnouncements } from '@/ai/flows/summarize-announcements';
import { answerFromLink } from '@/ai/flows/answer-from-link';
import { stt } from '@/ai/flows/stt-flow';
import { tts } from '@/ai/flows/tts-flow';
import { getAnnouncementsFromDB } from '@/lib/data';
import type { Announcement } from '@/lib/types';


export async function askChatbot(
  query: string,
  context?: {announcement: Announcement}
): Promise<{ response: string; mapLink?: string; audio?: string }> {
  const lowerCaseQuery = query.toLowerCase();

  let resultPromise;

  if (context?.announcement?.link) {
    resultPromise = (async () => {
      try {
        const result = await answerFromLink({ query, url: context.announcement.link });
        return { response: result.answer };
      } catch (error) {
        console.error('Error answering from link:', error);
        return { response: "Sorry, I couldn't process the content from the provided link. Please try again." };
      }
    })();
  } else if (lowerCaseQuery.includes('announcement') || lowerCaseQuery.includes('update')) {
    resultPromise = (async () => {
      try {
        const announcements = await getAnnouncementsFromDB();
        if (announcements.length === 0) {
          return { response: "There are no new announcements at the moment." };
        }
        
        const result = await summarizeAnnouncements({ announcements });
        return { response: result.summary, announcements };
  
      } catch (error) {
        console.error('Error summarizing announcements:', error);
        return { response: "I couldn't fetch the latest announcements. Please try again." };
      }
    })();
  } else {
    // Default to the general Q&A flow
    resultPromise = (async () => {
      try {
        const result = await answerStudentQueries({ query });
        return { response: result.response, mapLink: result.mapLink };
      } catch (error) {
        console.error('Error answering query:', error);
        return { response: "Sorry, I'm having trouble thinking right now. Please ask something else." };
      }
    })();
  }

  const [chatResult] = await Promise.all([resultPromise]);

  if (chatResult.response) {
    try {
      const { audio } = await tts({ text: chatResult.response });
      return { ...chatResult, audio };
    } catch (error: any) {
      // Don't log rate-limiting errors as they are expected on the free tier.
      if (error.message && !error.message.includes('429')) {
         console.error('Error in TTS:', error);
      }
      // still return text result if TTS fails
      return chatResult;
    }
  }

  return chatResult;
}

export async function transcribeAudio(audioDataUri: string): Promise<string> {
  try {
    const { text } = await stt({ audio: audioDataUri });
    return text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return '';
  }
}
