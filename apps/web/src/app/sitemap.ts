import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/devenir-artisan",
    "/comment-ca-marche",
    "/tarifs",
    "/mentions-legales",
    "/cgu",
    "/politique-confidentialite",
    "/contact",
  ];
  return routes.map((r) => ({
    url: `https://depanni.ma${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.6,
  }));
}
