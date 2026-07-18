const deploymentUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  process.env.CF_PAGES_URL ??
  process.env.URL ??
  "http://localhost:3000";

const normalizedUrl = deploymentUrl.startsWith("http") ? deploymentUrl : `https://${deploymentUrl}`;

export const siteUrl = new URL(normalizedUrl).origin;
