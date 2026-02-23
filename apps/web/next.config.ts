import type { NextConfig } from "next";
import path from "path";

const backendBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ||
  "http://localhost:4000";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(process.cwd(), "../.."),
  },
  async rewrites() {
    return [
      {
        source: "/api/auth",
        destination: `${backendBaseUrl}/api/auth`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${backendBaseUrl}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
