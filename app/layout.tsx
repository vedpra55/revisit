import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://revisit.co"),
  title: {
    default: "Revisit — Customer retention for independent restaurants & cafés",
    template: "%s | Revisit",
  },
  description:
    "We remember your regular customers and give them a reason to come back straight from your counter. No POS replacement, no app download.",
  applicationName: "Revisit",
  keywords: [
    "restaurant customer retention",
    "café loyalty",
    "restaurant CRM",
    "regular customer retention",
    "counter checkout retention",
  ],
  authors: [{ name: "Revisit" }],
  openGraph: {
    title: "Revisit — Customer retention for independent restaurants & cafés",
    description:
      "We remember your regular customers and give them a reason to come back straight from your counter. No POS replacement, no app download.",
    url: "https://revisit.co",
    siteName: "Revisit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Revisit — Know your customer. Bring them back.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Revisit — Customer retention for independent restaurants & cafés",
    description:
      "We remember your regular customers and give them a reason to come back straight from your counter. No POS replacement, no app download.",
    images: ["/images/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAFA] text-[#0A0A0B]">{children}</body>
    </html>
  );
}
