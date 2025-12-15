import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Footer from "~/components/Footer";
import Title from "~/components/Title";

export const metadata: Metadata = {
  title: "The Custard Screams",
  description: "London based Post Hardcore Punk Rock Band",
  icons: [
    {
      rel: "icon",
      url: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1Wu9GgIUOvpXGBUM3TayYgd68ANQbRfo01SLV",
    },
    {
      rel: "apple-touch-icon",
      url: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jNWCBe9CW63sKRVJPxiQH09w81nhzYZI5bMg",
      sizes: "180x180",
    },
    {
      rel: "icon",
      url: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX125lhOH54f6C7O5UiyzsSR8NkawKYFJxpQXub",
      type: "img/png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      url: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1mGp6uNMjTQkG4hEKUy1iDXwJAzfC73u9NL5O",
      type: "img/png",
      sizes: "16x16",
    },
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
    <html lang="en-GB" className={`${geist.variable}`}>
      <body className="bg-black text-white">
        <div className="mx-auto max-w-4xl min-w-[320px] bg-black p-2 md:p-3">
          <Title />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
