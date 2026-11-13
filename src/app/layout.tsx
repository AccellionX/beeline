import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BeeLine · Busy Bee's Weddings & Events",
  description:
    "Signed → planning ready. A sales demo showing how one signed HoneyBook contract sets up planning tools through Zapier.",
  openGraph: {
    title: "BeeLine · Busy Bee's Weddings & Events",
    description:
      "Signed → planning ready. Concept demo for Busy Bee's Weddings & Events.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeeLine · Busy Bee's Weddings & Events",
    description:
      "Signed → planning ready. Concept demo for Busy Bee's Weddings & Events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-plum antialiased dark:bg-plum dark:text-cream">
        {children}
      </body>
    </html>
  );
}
