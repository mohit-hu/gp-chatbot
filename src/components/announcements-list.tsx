'use client';

import { BookOpen, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Announcement } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAnnouncements(): Promise<Announcement[]> {
      if (!db) {
        console.warn("Firebase is not configured, can't fetch announcements.");
        // Return dummy data if Firebase is not configured
        return [
          {
            id: '1',
            title: 'Welcome to GP Chatbot',
            description: 'Introducing our new AI-powered chatbot for student queries.',
            date: new Date().toISOString(),
            link: 'https://example.com/welcome',
          },
          {
            id: '2',
            title: 'Campus Maintenance Notice',
            description: 'The library will be closed for maintenance on Friday.',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            link: 'https://example.com/maintenance',
          },
          {
            id: '3',
            title: 'New Course Registration',
            description: 'Registration for the new AI course is now open.',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            link: 'https://example.com/registration',
          },
        ];
      }
      const announcementsCol = collection(db, 'announcements');
      const q = query(announcementsCol, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const announcements = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamp to a displayable string
        const date =
          data.date instanceof Timestamp ? data.date.toDate() : new Date();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          link: data.link,
          date: date.toISOString(), // Store as ISO string
        };
      });
      return announcements;
    }

    async function fetchAnnouncements() {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err: any) {
        console.error('Error fetching announcements:', err);
        setError(err.message || 'Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <BookOpen className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold font-headline text-primary">
          Announcements
        </h2>
      </div>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        {loading && (
          <div className="flex items-center justify-center pt-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">
              Loading latest announcements...
            </p>
          </div>
        )}

        {!loading && error && (
          <Alert variant="destructive">
            <AlertTitle>Loading Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && announcements.length === 0 && (
          <Alert>
            <AlertTitle>No Announcements</AlertTitle>
            <AlertDescription>
              There are no new announcements at the moment. Please check back
              later.
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && announcements.length > 0 && (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="transition-all hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground pt-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {new Date(announcement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80">
                    {announcement.description}
                  </p>
                </CardContent>
                {announcement.link && (
                  <CardFooter>
                    <Link
                      href={announcement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge variant="secondary" className="hover:bg-primary/10">
                        Read More
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Badge>
                    </Link>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
