'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 max-w-md">
        <div className="flex gap-3">
          <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 bg-muted p-2 rounded text-xs overflow-auto max-h-32">
                {error.stack}
              </pre>
            )}
            <Button onClick={() => reset()} className="mt-4">
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
