import type { ReactNode } from "react";
import "../globals.css";
import { KeystaticFooter } from "./KeystaticFooter";

export const metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="keystatic-admin-shell">
          <nav className="keystatic-admin-nav" aria-label="Keystatic admin navigation">
            <div className="keystatic-admin-nav__left" />
            <div className="keystatic-admin-nav__right" />
          </nav>
          <div className="keystatic-admin-content">
            <div className="keystatic-admin-panel">
              {children}
              <KeystaticFooter />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
