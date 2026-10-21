/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  // The dev-only Next.js badge covers the sidebar account button and the send button.
  devIndicators: false,
  // Pin the project root so Next doesn't pick up a lockfile from a parent folder.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
