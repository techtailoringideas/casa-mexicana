const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kbyvujoxzfwsydplyxdx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
