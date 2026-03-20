import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fbo_calculator",
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
