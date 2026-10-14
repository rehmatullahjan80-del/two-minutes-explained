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
            <div className="keystatic-admin-nav__left">
              <a href="/keystatic" className="keystatic-admin-link">Content</a>
            </div>
            <div className="keystatic-admin-nav__right">
              <a href={vercelUrl} target="_blank" rel="noreferrer" className="keystatic-admin-link keystatic-admin-link--primary">Vercel Analytics</a>
              <a href={googleUrl} target="_blank" rel="noreferrer" className="keystatic-admin-link">Google Analytics</a>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
