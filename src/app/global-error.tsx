"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-critical-tint text-critical">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
          <p className="max-w-sm text-ink-muted">
            An unexpected error occurred. Our team has been notified — please try again.
          </p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
}

