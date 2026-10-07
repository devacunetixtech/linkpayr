import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "PayLink — Send money with a link",
  description: "Create simple, verifiable BOT Chain payment links.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "PayLink — Send money with a link",
    description: "Create and pay verifiable BOT Chain payment links.",
    images: ["/profile-logo.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={inter.className}><Providers>{children}</Providers></body></html>;
}
