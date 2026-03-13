/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: false,
  compress: true,
  basePath: '',
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://www.livehindustan.com"
          }
        ],
        // Fonts
        source: '/:all*(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.livehindustan.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
        ],
      },
      {
        // CSS and JS files
        source: '/:all*(css|js)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.livehindustan.com',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
