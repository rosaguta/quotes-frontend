/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    images : {
      domains : ['localhost'] // <== Domain name
    },
    webpack: (config, { dev, isServer }) => {
      // if (!dev && !isServer) {
      //   Object.assign(config.resolve.alias, {
      //     "react/jsx-runtime.js": "preact/compat/jsx-runtime",
      //     react: "preact/compat",
      //     "react-dom/test-utils": "preact/test-utils",
      //     "react-dom": "preact/compat",
      //   });
      // }
      return config;
    }
  }

export default nextConfig;
