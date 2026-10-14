import type { ReactNode } from "react";

export const metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="keystatic-admin-shell">
          <nav className="keystatic-admin-nav" aria-label="Keystatic admin navigation">
            <a href="/keystatic">Content</a>
            <a href="/keystatic/analytics">Analytics</a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
