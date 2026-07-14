import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO date
  displayDate: string;
  updated?: string;
  description: string;
  category: string;
};

export type Post = PostMeta & { html: string };

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getPosts(): PostMeta[] {
  const slugs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) =>
      fs.existsSync(path.join(CONTENT_DIR, slug, "index.md"))
    );

  const posts = slugs.map((slug) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, slug, "index.md"), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      displayDate: formatDate(data.date as string),
      updated: data.updated ? formatDate(data.updated as string) : undefined,
      description: (data.description as string) ?? "",
      category: ((data.category as string) ?? "unfiled").toLowerCase(),
    };
  });

  // newest first
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

export function getPost(slug: string): Post {
  const meta = getPosts().find((p) => p.slug === slug);
  if (!meta) throw new Error(`unknown post: ${slug}`);

  const raw = fs.readFileSync(path.join(CONTENT_DIR, slug, "index.md"), "utf8");
  const { content } = matter(raw);

  // Assets live next to index.md and are collected into public/blog/<slug>/
  // by scripts/collect-assets.mjs — rewrite relative references to that URL.
  const resolved = content
    .replace(/\]\(\.\//g, `](/blog/${slug}/`)
    .replace(/src="\.\//g, `src="/blog/${slug}/`);

  const html = marked.parse(resolved, { async: false }) as string;
  return { ...meta, html };
}
