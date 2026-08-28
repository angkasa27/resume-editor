import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  fontDmSans,
  fontIbmPlexSans,
  fontLato,
  fontLora,
  fontManrope,
  fontMerriweather,
  fontMontserrat,
  fontNunitoSans,
  fontOpenSans,
  fontPlayfairDisplay,
  fontPlusJakartaSans,
  fontPoppins,
  fontRaleway,
  fontRoboto,
  fontSourceSans3,
  fontWorkSans,
} from "@/app/fonts";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: brand.title,
  description: brand.description,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: brand.title,
    description: brand.description,
    url: "/",
    siteName: brand.name,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: brand.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.title,
    description: brand.description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
        geistMono.variable,
        fontLato.variable,
        fontOpenSans.variable,
        fontRoboto.variable,
        fontMerriweather.variable,
        fontPlayfairDisplay.variable,
        fontLora.variable,
        fontPlusJakartaSans.variable,
        fontPoppins.variable,
        fontMontserrat.variable,
        fontDmSans.variable,
        fontWorkSans.variable,
        fontNunitoSans.variable,
        fontSourceSans3.variable,
        fontRaleway.variable,
        fontManrope.variable,
        fontIbmPlexSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
