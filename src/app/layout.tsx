"use client";

import { Bebas_Neue, Geist } from "next/font/google";
import { CookieConsentProvider } from "~/contexts/CookieConsentContext";
import { NavigationProvider } from "~/contexts/NavigationContext";
import "~/styles/globals.css";
import "~/styles/punk-icons.css";
import "~/styles/punk-typography.css";
import { LayoutClient } from "./LayoutClient";
import { LayoutCookieComponents } from "./LayoutCookieComponents";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${geist.variable} ${bebasNeue.variable}`}>
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
        <CookieConsentProvider>
          <NavigationProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
            
            {/* Cookie consent UI components */}
            <LayoutCookieComponents />
          </NavigationProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
