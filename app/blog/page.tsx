import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, resolveImageUrl } from "@/lib/blog";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog | AVIR",
  description:
    "California Living at its Finest: The Latest in Luxury Home Automation. Read the AVIR blog for news on home cinema, automation, lighting, shading, and more.",
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: {
    title: "Blog | AVIR",
    description:
      "California Living at its Finest: The Latest in Luxury Home Automation.",
    type: "website",
    url: canonicalUrl("/blog"),
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AVIR Blog",
    description:
      "California Living at its Finest: The Latest in Luxury Home Automation",
    url: "https://www.avir.com/blog",
    publisher: {
      "@type": "Organization",
      name: "AVIR",
      url: "https://www.avir.com",
    },
    blogPost: posts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.dateISO,
      url: `https://www.avir.com/post/${post.slug}`,
      image: resolveImageUrl(post.heroImage),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Title section — matches Webflow .section.title pattern */}
      <section className="section-title">
        <div className="title__bg" />
        <div className="container">
          <div className="col-wrapper">
            <div className="col-50">
              <h1 className="page-title">Blog</h1>
            </div>
            <div className="col-50 title-right">
              <p>
                California Living at its Finest: The Latest in Luxury Home
                Automation
                <br />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog list */}
      <section className="section">
        <div className="container">
          <div className="blog__list-wrapper">
            <div className="blog__list" role="list">
              {posts.map((post) => {
                const imgSrc = resolveImageUrl(post.heroImage);
                // Extract first sentence from excerpt for cleaner card text
                const excerptClean =
                  post.excerpt.length > 200
                    ? post.excerpt.slice(0, 200).trimEnd() + "..."
                    : post.excerpt;

                return (
                  <div key={post.slug} className="blog__item" role="listitem">
                    <Link
                      href={`/post/${post.slug}`}
                      className="blog__link-wrap"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={post.title}
                        loading="lazy"
                        width={2000}
                        className="blog__image"
                      />
                      <h3>{post.title}</h3>
                      <div className="blog__date">{post.date}</div>
                      <p>{excerptClean}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
