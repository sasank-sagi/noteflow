import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js not to bundle better-sqlite3 (native Node.js module).
  // Works with both Turbopack (Next.js 16 default) and webpack.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
