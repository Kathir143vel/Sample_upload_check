/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: process.env.BACKEND_URL
          ? `${process.env.BACKEND_URL}/:path*`
          : 'http://localhost:8000/:path*',
      },
    ];
  },
  images: {
    domains: ['tile.openstreetmap.org'],
  },
};

module.exports = nextConfig;
