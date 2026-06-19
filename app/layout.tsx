import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { connection } from "next/server";
import { headers } from "next/headers";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { YandexMetrika } from "@/components/layout/yandex-metrika";
import { siteConfig } from "@/lib/data";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Force dynamic rendering so the CSP nonce is available for this request.
  await connection();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans min-h-screen flex flex-col`}>
        <ThemeProvider>
          <ConditionalHeader />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
          <CookieBanner />
        </ThemeProvider>
        <YandexMetrika nonce={nonce} />
      </body>
    </html>
  );
}
