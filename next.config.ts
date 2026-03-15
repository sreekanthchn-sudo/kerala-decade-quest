import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/kerala-decade-quest" : "",
  assetPrefix: isProd ? "/kerala-decade-quest/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
