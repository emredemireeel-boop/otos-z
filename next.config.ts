import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: '*.sahibinden.com',
            },
            {
                protocol: 'https',
                hostname: '*.arabam.com',
            },
        ],
    },
};

export default nextConfig;
