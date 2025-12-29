/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // GitHub Pages (static export) support:
  // - NEXT_EXPORT=1 enables `output: "export"` which emits `out/`
  // - NEXT_PUBLIC_BASE_PATH should be "" for user/org pages, or "/repo" for project pages
  ...(isExport
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
        basePath,
        assetPrefix: basePath
      }
    : {}),
  experimental: {
    optimizePackageImports: ["@observablehq/plot"]
  }
};

export default nextConfig;


