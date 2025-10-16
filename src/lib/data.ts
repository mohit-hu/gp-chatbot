import type { Announcement } from './types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';


export const campusLocations = [
    { name: 'Mechanical Block', id: 'mechanical-block', query: 'Where is the Mechanical Block?' },
    { name: 'Computer Block', id: 'computer-block', query: 'How to reach the Computer Block?' },
    { name: 'Admin Block', id: 'admin-block', query: 'Location of the Admin Block' },
    { name: 'Workshop', id: 'workshop', query: 'Where is the workshop?' },
    { name: 'Library', id: 'library', query: 'Directions to the library' },
    { name: 'Canteen', id: 'canteen', query: 'Where is the canteen?' },
];

export async function getAnnouncementsFromDB(): Promise<Announcement[]> {
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
  const announcements = querySnapshot.docs.map(doc => {
    const data = doc.data();
    const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      link: data.link,
      date: date.toISOString(),
    };
  });
  return announcements;
}
