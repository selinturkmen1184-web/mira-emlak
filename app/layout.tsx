import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const baseUrl = host ? `${protocol}://${host}` : "https://mira-emlak.pages.dev";
  const socialImage = `${baseUrl}/og-v6.jpg`;
  const title = "MIRA | Seçkin Gayrimenkul & Yatırım";
  const description = "Seçkin portföyler, güvenilir danışmanlık ve bölge analizleriyle yeni nesil gayrimenkul ve yatırım deneyimi.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      siteName: "Mira Emlak",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "MIRA — Seçkin Gayrimenkul ve Yatırım" }],
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
