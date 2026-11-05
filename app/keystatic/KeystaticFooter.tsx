const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_URL || "https://vercel.com/";
const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_URL || "https://analytics.google.com/analytics/web/";

export function KeystaticFooter() {
  return (
    <div className="keystatic-admin-footer-actions" aria-label="Analytics links">
      <h3 className="keystatic-admin-footer-title">Analytics</h3>
      <a href={vercelUrl} target="_blank" rel="noreferrer" className="keystatic-admin-link keystatic-admin-link--primary">
        Vercel Analytics
      </a>
      <a href={googleUrl} target="_blank" rel="noreferrer" className="keystatic-admin-link">
        Google Analytics
      </a>
    </div>
  );
}
