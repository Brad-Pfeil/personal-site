import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Bradley Pfeil — Data Scientist",
    template: "%s · Bradley Pfeil"
  },
  description:
    "Data science portfolio: dynamic pricing, NL-to-SQL, adaptive data layout optimization, and interactive demos.",
  openGraph: {
    title: "Bradley Pfeil — Data Scientist",
    description:
      "Data science portfolio: dynamic pricing, NL-to-SQL, adaptive data layout optimization, and interactive demos.",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}


