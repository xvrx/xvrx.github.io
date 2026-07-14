import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Typer from "@/components/Typer";
import { IndexReveal } from "@/components/reveals";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "The Holy Bullshitology",
  description: "Index of filings — writing down the impulsive thoughts.",
};

export default function BlogIndex() {
  const posts = getPosts();
  /* posts are newest-first, so category order follows recency */
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <>
      <main className="page">
        <IndexReveal />
        <header className="index-header">
          <p className="eyebrow">THE HOLY BULLSHITOLOGY</p>
          <h1>Index of Filings</h1>
          <p className="index-sub">
            <Typer
              startDelay={700}
              speed={18}
              segments={[{ text: "writing down the impulsive thoughts." }]}
            />
          </p>
        </header>

        {categories.map((category) => (
          <section className="cat-group" key={category}>
            <h2 className="cat-label">
              <span className="cat-mark" aria-hidden="true">§</span>
              {category}
            </h2>
            <ol className="filings">
              {posts
                .filter((p) => p.category === category)
                .map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}/`} className="filing">
                      <span className="filing-main">
                        <span className="filing-title">{post.title}</span>
                        {post.description && (
                          <span className="filing-desc">
                            {post.description}
                          </span>
                        )}
                      </span>
                      <span className="filing-date">
                        <em>FILED</em>
                        {post.displayDate}
                      </span>
                    </Link>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
