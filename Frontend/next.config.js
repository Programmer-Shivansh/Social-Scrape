/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      'instagram.com',
      'scontent.cdninstagram.com',
      'scontent-iad3-1.cdninstagram.com',
      'instagram.fdel15-1.fna.fbcdn.net',
      'instagram.fdel15-2.fna.fbcdn.net'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.fbcdn.net'
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com'
      },
      {
        protocol: 'https',
        hostname: '**.instagram.com'
      }
    ]
  }
}

module.exports = nextConfig