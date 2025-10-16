import Chatbot from '@/components/chatbot/chatbot';
import InteractiveMap from '@/components/interactive-map';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)]">
      <div className="w-full md:w-1/2 flex flex-col p-4 space-y-4">
        <InteractiveMap />
      </div>
      <div className="w-full md:w-1/2 flex flex-col">
        <Chatbot />
      </div>
    </div>
  );
}
