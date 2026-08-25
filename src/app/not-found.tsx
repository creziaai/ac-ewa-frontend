import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <h1 className="font-display text-5xl font-semibold text-ink">404</h1>
      <p className="max-w-sm text-ink-muted">This page doesn&apos;t exist, or you might not have access to it.</p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}

