import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Script from "next/script";
import { IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import ConsentBanner from "./consent";
import { SITE, getSite } from "@/lib/content";

const GA = process.env.NEXT_PUBLIC_GA_ID;
const font = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSite();
  return {
    metadataBase: new URL(SITE),
    title: { default: s.siteName, template: `%s | ${s.siteName}` },
    description: s.tagline || "Written notes and quick recaps for every video.",
    openGraph: { siteName: s.siteName, type: "website" },
    twitter: { card: "summary" },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const s = await getSite();
  return (
    <html lang="en" className={font.className}>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body>
        <header>
          <div className="bar">
            <Link href="/" className="brand">
              <span className="logo-mark" aria-hidden="true">{s.siteName.trim().charAt(0)}</span>
              {s.siteName}
            </Link>
            <nav className="menu" aria-label="Main">
              <Link href="/">Home</Link>
              <Link href="/topics">All topics</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact us</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        {GA && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});try{if(localStorage.getItem('consent')==='granted')gtag('consent','update',{analytics_storage:'granted'})}catch(e){}gtag('js',new Date());gtag('config','${GA}');`}
            </Script>
            <ConsentBanner />
          </>
        )}
        <Analytics />
      </body>
    </html>
  );
}
