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
    return [];
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
