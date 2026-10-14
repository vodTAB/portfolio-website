
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sfo.cloud.appwrite.io",
      },
    ],
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
