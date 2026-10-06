import { SITE } from "@/lib/content";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/"] }, sitemap: `${SITE}/sitemap.xml` };
}
