import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "LinkPayr — Payment requests made simple",
  description: "Create simple, verifiable BOT Chain payment requests.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "LinkPayr — Payment requests made simple",
    description: "Create and pay verifiable BOT Chain payment requests.",
    images: ["/linkpayr-profile-logo.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={inter.className}><Providers>{children}</Providers></body></html>;
}
