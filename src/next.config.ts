
import type {NextConfig} from 'next';

const securityHeaders = [
  // Enforces HTTPS connections
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  // Prevents browsers from MIME-sniffing a response away from the declared content-type
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Prevents the page from being displayed in a frame, iframe, embed, or object
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // Controls how much referrer information is sent with requests
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Disables browser features and APIs on the page
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Ensures TypeScript errors fail the build
  },
  eslint: {
    ignoreDuringBuilds: false, // Ensures ESLint errors fail the build
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photos.fife.usercontent.google.com',
        port: '',
        pathname: '/**',
      },
      { 
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
