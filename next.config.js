const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional separate output dir so a production build can run beside `next dev` without clobbering it.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Native/wasm packages used by the OG image renderer stay outside the server bundle.
    serverComponentsExternalPackages: ['satori', 'sharp'],
    // Optional cap on build workers for low-memory machines (e.g. NEXT_BUILD_CPUS=1); unset = Next default.
    ...(process.env.NEXT_BUILD_CPUS ? { cpus: Number(process.env.NEXT_BUILD_CPUS) } : {}),
  },
};

module.exports = withNextIntl(nextConfig);
