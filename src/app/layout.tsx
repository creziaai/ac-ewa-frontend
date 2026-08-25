import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: {
    default: "Accewa — Accessibility monitoring for the web you ship",
    template: "%s · Accewa",
  },
  description:
    "Accewa scans your websites against WCAG, tracks your accessibility score over time, and hands your team AI-assisted fixes before compliance becomes a fire drill.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GQJ7MR0SJP"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GQJ7MR0SJP');
          `}
        </Script>
      </body>
    </html>
  );
}