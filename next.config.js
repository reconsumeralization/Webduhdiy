/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      loaders: {
        // Optimize for turbo
      },
    },
  },
  async generateStaticParams() {
    return [];
  },
  // Disable static generation for docs pages
  export: {
    trailingSlash: true,
  },
  generateBuildId: async () => {
    return 'webduh-build';
  },
};

module.exports = nextConfig;
