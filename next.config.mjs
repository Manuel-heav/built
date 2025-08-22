/** @type {import('next').NextConfig} */
const isCI = Boolean(process.env.CI);
const nextConfig = {
  images: {
    domains: ['miftztgfemnglhjovkgg.supabase.co','salonlfc.com','minio.theblogrammer.com'],
  },
  // Avoid Windows symlink issues locally; still use standalone in CI
  ...(isCI ? { output: 'standalone' } : {}),
};

export default nextConfig;
