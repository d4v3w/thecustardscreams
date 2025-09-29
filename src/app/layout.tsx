import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "The Custard Screams",
  description: "London Post Hardcore Punk Rock Band",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
    { rel: "icon", url: "/favicon-32x32.png", type: "img/png", sizes: "32x32" },
    { rel: "icon", url: "/favicon-16x16.png", type: "img/png", sizes: "16x16" },
    { rel: "manifest", url: "/site.webmanifest" },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
