import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

const siteTitle = "Eryandhi Putro Nugroho";
const siteDescription = "Software engineer from Ponorogo, Indonesia — Fullstack .NET, IoT, Computer Vision, and Engineering Blog.";

export const GET: APIRoute = async ({ url }) => {
	const siteUrl = "https://nayreisme.dev";
	const { entries: posts } = await getEmDashCollection("posts", {
		orderBy: { created_at: "desc" },
		limit: 20,
	});

	const items = posts
		.filter((p) => p.data.publishedAt || p.data.createdAt)
		.map((post) => {
			const postUrl = `${siteUrl}/posts/${post.id}`;
			const pubDate = (post.data.publishedAt ?? post.data.createdAt) as Date;
			return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.excerpt || "")}</description>
    </item>`;
		})
		.join("\n");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`,
		{
			headers: {
				"Content-Type": "application/rss+xml; charset=utf-8",
				"Cache-Control": "public, max-age=3600",
			},
		},
	);
};

function escapeXml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}
