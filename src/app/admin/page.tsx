'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AddAnnouncementForm from './add-announcement-form';
import { UserCog } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
            <UserCog className="h-10 w-10 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage college announcements.</p>
            </div>
        </div>
      <AddAnnouncementForm />
    </div>
  );
}
