/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
    // Keep Prisma + libSQL/Turso packages out of the webpack bundle so they are
    // required from node_modules at runtime. This avoids bundling the optional
    // native libsql binary and keeps serverless functions building cleanly.
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@prisma/adapter-libsql",
      "@libsql/client",
      "libsql",
    ],
  },
};

module.exports = nextConfig;
