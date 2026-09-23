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

export default nextConfig;
