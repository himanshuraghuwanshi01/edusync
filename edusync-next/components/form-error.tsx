'use client';

import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  error?: string;
  errors?: Record<string, string>;
  className?: string;
}

export function FormError({ error, errors, className = '' }: FormErrorProps) {
  if (!error && (!errors || Object.keys(errors).length === 0)) {
    return null;
  }

  return (
    <div className={`rounded-lg bg-destructive/10 border border-destructive/30 p-3 ${className}`}>
      <div className="flex gap-2">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <div className="text-sm text-destructive">
          {error && <p>{error}</p>}
          {errors && Object.keys(errors).length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
