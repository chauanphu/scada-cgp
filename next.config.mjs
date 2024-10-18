/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',  // Your local API routes
          destination: 'https://api.cgp.captechvn.com/api/:path*', // Proxy to the external API
        },
      ];
    },
  };
  
  export default nextConfig;