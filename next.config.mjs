/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@my-repo/ui-components"],
  allowedDevOrigins: ["localhost"],
  allowedDevOrigins: ["10.0.0.*"],
  productionBrowserSourceMaps: true,
};

export default nextConfig;
