import type { ReactNode } from "react";

const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_URL || "https://vercel.com/";
const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_URL || "https://analytics.google.com/analytics/web/";

export const metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="keystatic-admin-shell">
          <nav className="keystatic-admin-nav" aria-label="Keystatic admin navigation">
            <a href="/keystatic">Content</a>
            <a href={vercelUrl} target="_blank" rel="noreferrer">Vercel Analytics</a>
            <a href={googleUrl} target="_blank" rel="noreferrer">Google Analytics</a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
