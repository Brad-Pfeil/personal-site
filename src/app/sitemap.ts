import type { MetadataRoute } from "next";

import { listProjectSlugs } from "@/lib/content";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await listProjectSlugs();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/projects`, lastModified: now },
    ...slugs.map((slug) => ({ url: `${base}/projects/${slug}`, lastModified: now })),
    { url: `${base}/playground`, lastModified: now },
    { url: `${base}/playground/kmeans`, lastModified: now },
    { url: `${base}/playground/gradient-descent`, lastModified: now },
    { url: `${base}/playground/ab-test`, lastModified: now },
    { url: `${base}/resume`, lastModified: now },
    { url: `${base}/contact`, lastModified: now }
  ];
}


