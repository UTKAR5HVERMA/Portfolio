import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Your other config options here */

  allowedDevOrigins: ['mutate-voicing-mocker.ngrok-free.dev'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;