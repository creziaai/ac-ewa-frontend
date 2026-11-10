import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";


export const metadata: Metadata = {
  metadataBase: new URL("https://accewa.cc.cd"),
  title: {
    default: "Accewa – AI-Powered Web Accessibility Testing Tool",
    template: "%s | Accewa",
  },
  description:
    "Accewa is an AI-powered web accessibility testing tool that helps developers and agencies identify WCAG-related website issues, review findings, and get AI-assisted remediation suggestions.",
  applicationName: "Accewa",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Accewa – Web Accessibility Testing Tool",
    description:
      "Identify website accessibility issues, review WCAG-related findings, and get AI-assisted remediation suggestions with Accewa.",
    url: "https://accewa.cc.cd",
    siteName: "Accewa",
    type: "website",
  },
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
