'use client';

import Link from 'next/link';
import { LogIn, LogOut, University, UserCog, Megaphone } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <University className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">G.P. Srinagar campus assistant</span>
        </Link>
        <div className="flex flex-1 items-center justify-between">
            <nav>
                <Button variant="ghost" asChild>
                    <Link href="/announcements">
                        <Megaphone />
                        <span className="ml-2 hidden sm:inline">Announcements</span>
                    </Link>
                </Button>
            </nav>
          <div className="flex items-center space-x-2">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/admin">
                      <UserCog />
                      <span className="ml-2 hidden sm:inline">Admin</span>
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout} size="sm">
                    <LogOut />
                    <span className="ml-2 hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Button asChild size="sm">
                  <Link href="/login">
                    <LogIn />
                    <span className="ml-2 hidden sm:inline">Admin Login</span>
                  </Link>
                </Button>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
