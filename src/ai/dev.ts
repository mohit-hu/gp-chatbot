import { config } from 'dotenv';
config();

import '@/ai/flows/extract-location-from-query.ts';
import '@/ai/flows/summarize-announcements.ts';
import '@/ai/flows/answer-student-queries.ts';
import '@/ai/flows/stt-flow';
import '@/ai/flows/tts-flow';
import '@/ai/flows/answer-from-link';
