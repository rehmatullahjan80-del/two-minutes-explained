const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_URL || "https://vercel.com/";
const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_URL || "https://analytics.google.com/analytics/web/";

export default function AnalyticsPage() {
  return (
    <main className="keystatic-analytics">
      <h1>Analytics</h1>
      <p className="lead">Open your traffic dashboards directly from the admin area.</p>

      <div className="analytics-grid">
        <a className="analytics-card" href={vercelUrl} target="_blank" rel="noreferrer">
          <h2>Vercel Analytics</h2>
          <p>Open the production analytics dashboard for this project.</p>
        </a>

        <a className="analytics-card" href={googleUrl} target="_blank" rel="noreferrer">
          <h2>Google Analytics</h2>
          <p>Open your GA4 views for acquisition, traffic, and audience insights.</p>
        </a>
      </div>
    </main>
  );
}
