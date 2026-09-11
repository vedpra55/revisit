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
  title: "Revisit — Customer retention for independent restaurants & cafés",
  description:
    "We remember your regular customers and give them a reason to come back straight from your counter. No POS replacement, no app download.",
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
