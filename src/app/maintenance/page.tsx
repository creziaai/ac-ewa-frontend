import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand-ink">
        <Wrench className="h-6 w-6" />
      </span>
      <h1 className="font-display text-3xl font-semibold text-ink">We&apos;ll be right back</h1>
      <p className="max-w-sm text-ink-muted">Accewa is undergoing scheduled maintenance. Thanks for your patience — check back shortly.</p>
    </div>
  );
}

