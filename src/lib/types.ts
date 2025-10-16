export type Announcement = {
  id: string;
  title: string;
  date: string; // Using string to simplify data fetching and display
  description: string;
  link?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mapLink?: string;
  audio?: string;
  announcements?: Announcement[];
  onAskAboutAnnouncement?: (announcement: Announcement) => void;
};
