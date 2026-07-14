import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { PostReveal } from "@/components/reveals";
import { getPost, getPosts } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post.title, description: post.description };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return (
    <>
      <main className="page page-narrow">
        <PostReveal />
        <p className="post-topbar">
          <Link href="/blog/" className="back-btn">
            <span className="back-arrow" aria-hidden="true">←</span> BACK TO INDEX
          </Link>
        </p>
        <article>
          <header className="post-header">
            <p className="eyebrow">
              <span className="eyebrow-red">§ {post.category.toUpperCase()}</span>
              <span className="eyebrow-sep">·</span>
              FILED {post.displayDate.toUpperCase()}
              {post.updated && (
                <>
                  <span className="eyebrow-sep">·</span>
                  AMENDED {post.updated.toUpperCase()}
                </>
              )}
            </p>
            <h1>{post.title}</h1>
          </header>
          <div
            className="markdown"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <p className="post-return">
            <Link href="/blog/">← Return to the index</Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
