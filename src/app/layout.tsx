"use client";

import { Geist } from "next/font/google";
import CookieConsent from "~/components/cookie/CookieConsent";
import { NavigationProvider } from "~/contexts/NavigationContext";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { hasConsent, acceptCookies, declineCookies } = useCookieConsent();

  return (
    <html lang="en-GB" className={`${geist.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>The Custard Screams</title>
        <meta
          name="description"
          content="London based Post Hardcore Punk Rock Band"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-black text-white">
        <NavigationProvider>
          {children}
          
          {/* Cookie Consent Banner - only show if user hasn't decided */}
          {hasConsent === null && (
            <CookieConsent onAccept={acceptCookies} onDecline={declineCookies} />
          )}
        </NavigationProvider>
      </body>
    </html>
  );
}
