
'use client';

import { University } from 'lucide-react';
import LoginForm from './login-form';
import ClientOnly from '@/components/client-only';

export default function LoginPage() {
  return (
    <div className="container flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
                <University className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-headline text-primary">Admin Login</h1>
            <p className="text-muted-foreground">Access the GarhwalConnect dashboard</p>
        </div>
        <ClientOnly>
          <LoginForm />
        </ClientOnly>
      </div>
    </div>
  );
}
