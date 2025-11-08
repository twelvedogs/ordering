/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@my-repo/ui-components"],
  allowedDevOrigins: ["localhost"],
};

export default nextConfig;
