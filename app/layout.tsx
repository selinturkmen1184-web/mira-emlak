import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const baseUrl = host ? `${protocol}://${host}` : "https://mira-emlak.pages.dev";
  const socialImage = `${baseUrl}/og-v2.png`;
  const title = "Mira Emlak | Seçilmiş Adresler";
  const description = "Yaşam biçiminize ve yatırım hedefinize göre seçilmiş gayrimenkuller. Yerel uzmanlık, güçlü temsil.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      siteName: "Mira Emlak",
      images: [{ url: socialImage, width: 1731, height: 909, alt: "Mira Emlak — Bir ev değil, doğru hayatı seçin" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
