'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatMessage, Announcement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User, MapPin, ExternalLink, Play, Pause, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    const handleAudioEnd = () => setActiveAudio(null);
    const handleAudioPause = () => setActiveAudio(null);
    const handleAudioPlay = () => {
        if (currentAudioRef) {
            setActiveAudio(currentAudioRef.src);
        }
    };

    if (currentAudioRef) {
        currentAudioRef.addEventListener('ended', handleAudioEnd);
        currentAudioRef.addEventListener('pause', handleAudioPause);
        currentAudioRef.addEventListener('play', handleAudioPlay);
    }

    return () => {
        if (currentAudioRef) {
            currentAudioRef.removeEventListener('ended', handleAudioEnd);
            currentAudioRef.removeEventListener('pause', handleAudioPause);
            currentAudioRef.removeEventListener('play', handleAudioPlay);
        }
    };
  }, [activeAudio]);

  const toggleAudio = (audioSrc: string) => {
    if (audioRef.current && activeAudio === audioSrc) {
        audioRef.current.pause();
    } else {
        if (audioRef.current) {
            audioRef.current.src = audioSrc;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    }
  };

  const renderAnnouncements = (announcements: Announcement[], onAskAboutAnnouncement?: (announcement: Announcement) => void) => (
    <div className="mt-2 space-y-2">
      <p className="font-bold text-sm">Here are the latest announcements:</p>
      <ul className="space-y-2">
        {announcements.map(ann => (
          <li key={ann.id} className="p-2 rounded-md bg-muted/50">
            <p className="font-semibold">{ann.title}</p>
            <p className="text-xs text-muted-foreground">{new Date(ann.date).toLocaleDateString()}</p>
            <p className="text-sm mt-1">{ann.description}</p>
            <div className="flex gap-2 mt-2">
              {ann.link && (
                <a href={ann.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-primary hover:bg-primary/10">
                    <LinkIcon className="h-4 w-4 mr-1"/> View Link
                  </Button>
                </a>
              )}
              {ann.link && onAskAboutAnnouncement && (
                 <Button variant="ghost" size="sm" className="h-auto p-1 text-primary hover:bg-primary/10" onClick={() => onAskAboutAnnouncement(ann)}>
                    <HelpCircle className="h-4 w-4 mr-1"/> Ask about this link
                 </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-6 space-y-6" ref={viewportRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-4',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                'max-w-md rounded-lg px-4 py-3 text-sm shadow-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.audio && (
                <Button variant="ghost" className="mt-2 h-auto p-2 text-left w-full justify-start text-primary hover:bg-primary/10" onClick={() => toggleAudio(message.audio!)}>
                    {activeAudio === message.audio ? <Pause className="h-4 w-4 mr-2 shrink-0"/> : <Play className="h-4 w-4 mr-2 shrink-0"/>}
                    {activeAudio === message.audio ? 'Pause' : 'Play Response'}
                </Button>
              )}
              {message.mapLink && (
                <a href={message.mapLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="mt-2 h-auto p-2 text-left w-full justify-start text-primary hover:bg-primary/10">
                      <MapPin className="h-4 w-4 mr-2 shrink-0"/>
                      View on Google Maps
                      <ExternalLink className="h-3 w-3 ml-auto"/>
                  </Button>
                </a>
              )}
              {message.announcements && renderAnnouncements(message.announcements, message.onAskAboutAnnouncement)}
            </div>

            {message.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 justify-start">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback>
                <Bot />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-sm rounded-lg px-4 py-3 text-sm shadow-sm bg-card flex items-center space-x-2">
              <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0" />
              <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
              <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300" />
            </div>
          </div>
        )}
         </div>
      </ScrollArea>
    </>
  );
}
