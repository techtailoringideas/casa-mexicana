const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co", // wildcard = works for ANY supabase project permanently
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
