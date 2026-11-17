/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [{ hostname: 'localhost' }, { hostname: 'quotes.rosevanleeuwen.com' }, { hostname: 'kahoot.rosevanleeuwen.com' }],
  },
}

export default nextConfig;
