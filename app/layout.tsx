import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const rawHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const host = rawHost?.split(",")[0]?.trim().toLowerCase();
  const trustedHost = Boolean(host && (
    host === "localhost" ||
    host.startsWith("localhost:") ||
    host === "127.0.0.1" ||
    host.startsWith("127.0.0.1:") ||
    host === "selinturkmen1184-web.github.io" ||
    host.endsWith(".pages.dev") ||
    host.endsWith(".chatgpt.site")
  ));
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = host?.startsWith("localhost") || host?.startsWith("127.0.0.1")
    ? "http"
    : forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : "https";
  const baseUrl = trustedHost ? `${protocol}://${host}` : "https://mira-emlak.pages.dev";
  const socialImage = `${baseUrl}/og.png`;
  const title = "RealYerin | Türkiye'nin Emlak Platformu";
  const description = "Satılık ve kiralık konut, villa, arsa ve iş yeri ilanlarını güvenle keşfet. RealYerin'de üyelik ve ilan vermek ilk 12 ay ücretsiz.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      siteName: "RealYerin",
      images: [{ url: socialImage, width: 1731, height: 909, alt: "RealYerin — Aradığın yer, gerçekten yerinde" }],
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
