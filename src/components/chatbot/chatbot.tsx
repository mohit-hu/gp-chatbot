'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import type { ChatMessage, Announcement } from '@/lib/types';
import { askChatbot, transcribeAudio } from '@/app/actions';
import { Badge } from '@/components/ui/badge';

type ChatContext = {
  announcement: Announcement;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext | undefined>(undefined);

  const preloadedQueries = [
    "What are today's announcements?",
    'Where is the mechanical block?',
    'Who is the principal?',
  ];

  const handleSendMessage = async (input: string, context?: ChatContext) => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await askChatbot(input, context);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        mapLink: result.mapLink,
        audio: result.audio,
        // @ts-ignore
        announcements: result.announcements,
        onAskAboutAnnouncement: (announcement: Announcement) => {
            setChatContext({ announcement });
            const prompt = `Tell me more about the announcement: "${announcement.title}"`;
            handleSendMessage(prompt, { announcement });
        }
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (context) {
        setChatContext(undefined);
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioSubmit = async (audioDataUri: string) => {
    setIsLoading(true);
    try {
      const transcribedText = await transcribeAudio(audioDataUri);
      if (transcribedText) {
        handleSendMessage(transcribedText, chatContext);
      }
    } catch (error) {
      console.error('Error handling audio submission:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't understand the audio. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreloadedQuery = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <div className="p-4 border-b">
        <h2 className="flex items-center gap-2 font-headline text-2xl text-primary">
          <Bot className="h-7 w-7" />
          GP Srinagar InfoBot
        </h2>
        <p className="text-sm text-muted-foreground">
          {chatContext ? `Asking about: ${chatContext.announcement.title}` : "Ask me anything about the campus, announcements, and more."}
        </p>
      </div>

      <ChatMessages messages={messages} isLoading={isLoading} />

      <div className="p-4 border-t bg-background">
        {messages.length === 0 && !isLoading && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2 text-center">
              Or try one of these prompts:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {preloadedQueries.map((query) => (
                <Badge
                  key={query}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handlePreloadedQuery(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <ChatInput
          onSubmit={(input) => handleSendMessage(input, chatContext)}
          onAudioSubmit={handleAudioSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
