import { type Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thecustardscreams.com"),
  title: {
    default: "The Custard Screams",
    template: "%s | The Custard Screams",
  },
  description: "London based Post Hardcore Punk Rock Band",
  applicationName: "The Custard Screams",
  keywords: [
    "The Custard Screams",
    "Custard Screams",
    "London",
    "band",
    "post-hardcore",
    "punk",
    "rock",
    "music",
    "live shows",
    "gigs",
  ],
  authors: [{ name: "The Custard Screams" }],
  creator: "The Custard Screams",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.thecustardscreams.com",
    title: {
      default: "The Custard Screams",
      template: "%s | The Custard Screams",
    },
    description: "London based Post Hardcore Punk Rock Band",
    siteName: "The Custard Screams",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "The Custard Screams Logo",
      },
      {
        url: "/android-chrome-192x192.png",
        width: 192,
        height: 192,
        alt: "The Custard Screams Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "The Custard Screams",
      template: "%s | The Custard Screams",
    },
    description: "London based Post Hardcore Punk Rock Band",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "The Custard Screams Logo",
      },
    ],
  },
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "manifest", url: "/site.webmanifest" },
  ],
};
