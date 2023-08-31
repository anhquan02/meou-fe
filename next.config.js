/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/",
        destination: "/home", // Matched parameters can be used in the destination
      },
    ];
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || `http://localhost:8080`,
  },
};

module.exports = nextConfig;
