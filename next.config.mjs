/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
    ],
  },
  // Exclude downloaded assets from Lambda bundle (prevents 565MB+ size error)
  // Assets are served as static files from public/, not bundled into serverless functions
  outputFileTracingExcludes: {
    '*': [
      './public/assets/**',
      'public/assets/**',
      './public/images/services/**',
      'public/images/services/**',
    ],
  },
};

export default nextConfig;
