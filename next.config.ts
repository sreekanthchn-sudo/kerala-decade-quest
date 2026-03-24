import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
/** Must match your GitHub repository name for username.github.io/repo/ Pages URLs. */
const BASE_PATH = isProd ? "/kerala-decade-quest" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH || undefined,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
