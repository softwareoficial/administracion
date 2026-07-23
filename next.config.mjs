/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8081/api/:path*',
      },
      {
        source: '/execute',
        destination: 'http://localhost:8081/execute',
      },
    ];
  },
};
export default nextConfig;
