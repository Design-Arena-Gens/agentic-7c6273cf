import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CiviRent | Civil Engineering Equipment Rentals",
  description:
    "Reserve heavy civil equipment, batching plants, and surveying instruments with Razorpay-backed payments and nationwide support.",
  openGraph: {
    title: "CiviRent | Civil Engineering Equipment Rentals",
    description:
      "Reserve heavy civil equipment, batching plants, and surveying instruments with Razorpay-backed payments and nationwide support.",
    url: "https://agentic-7c6273cf.vercel.app",
    siteName: "CiviRent",
    locale: "en_IN",
    type: "website",
  },
  metadataBase: new URL("https://agentic-7c6273cf.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-100 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
