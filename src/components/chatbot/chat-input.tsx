'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  onAudioSubmit: (audio: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, onAudioSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
    }
    if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    if (isRecording || isLoading) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      
      recorder.ondataavailable = (event) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onAudioSubmit(reader.result);
          }
        };
        reader.readAsDataURL(event.data);
      };

      recorder.onstop = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContext.current && audioContext.current.state !== 'closed') {
            audioContext.current.close();
        }
        if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
        }
        setIsRecording(false);
      }

      setIsRecording(true);
      detectSilence(stream);

    } catch (err) {
      console.error('Error starting recording:', err);
      // Fallback in case of error
      stopRecording();
    }
  };

  const detectSilence = (stream: MediaStream) => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyser.current = audioContext.current.createAnalyser();
    mediaStreamSource.current = audioContext.current.createMediaStreamSource(stream);
    mediaStreamSource.current.connect(analyser.current);
    analyser.current.fftSize = 2048;
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const SILENCE_THRESHOLD = 20; // out of 255
    const SILENCE_DELAY = 1500; // 1.5 seconds

    const checkSilence = () => {
        if (!isRecording) return;
        analyser.current?.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += Math.abs(dataArray[i] - 128);
        }
        const average = sum / bufferLength;

        if (average < SILENCE_THRESHOLD) {
            if (!silenceTimer.current) {
                silenceTimer.current = setTimeout(() => {
                    stopRecording();
                }, SILENCE_DELAY);
            }
        } else {
            if (silenceTimer.current) {
                clearTimeout(silenceTimer.current);
                silenceTimer.current = null;
            }
        }
        if (mediaRecorder?.state === "recording") {
          requestAnimationFrame(checkSilence);
        }
    };
    checkSilence();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={isRecording ? "Recording... (stop speaking to send)" : "Type your message or use the mic..."}
        className="flex-1 resize-none"
        rows={1}
        disabled={isLoading || isRecording}
      />
      <Button
        type="button"
        size="icon"
        variant={isRecording ? 'destructive' : 'secondary'}
        onClick={toggleRecording}
        disabled={isLoading}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim() || isRecording}
        aria-label="Send Message"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </form>
  );
}
