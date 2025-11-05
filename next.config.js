/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@headlessui/react", "framer-motion", "luxon", "clsx", "swr"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

module.exports = nextConfig;
