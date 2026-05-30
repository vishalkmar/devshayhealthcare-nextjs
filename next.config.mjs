/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Body size for uploads handled in route handlers; keep server actions limit generous.
  experimental: {
    serverActions: { bodySizeLimit: '15mb' },
  },
};

export default nextConfig;
