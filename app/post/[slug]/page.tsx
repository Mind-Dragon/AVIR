import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getPostBySlug,
  resolveImageUrl,
  rewriteBodyImages,
} from "@/lib/blog";

/* ------------------------------------------------------------------ */
/*  Static params — pre-render all 108 slugs                           */
/* ------------------------------------------------------------------ */

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Dynamic metadata                                                   */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found | AVIR" };

  const ogImage = resolveImageUrl(post.heroImage);
  const description =
    post.metaDescription ||
    post.bodyText.slice(0, 160).replace(/\s+/g, " ").trim();

  return {
    title: `${post.title} | AVIR`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.dateISO,
      url: `https://www.avir.com/post/${post.slug}`,
      images: [{ url: ogImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const heroSrc = resolveImageUrl(post.heroImage);
  const bodyHtml = rewriteBodyImages(post.bodyHtml, post.images);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.dateISO,
    ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
    image: heroSrc,
    url: `https://www.avir.com/post/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "AVIR",
      url: "https://www.avir.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.avir.com/post/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Title section with hero background image */}
      <section className="section-title">
        <div
          className="title__bg with-image"
          style={{ backgroundImage: `url(${heroSrc})` }}
        />
        <div className="container">
          <div className="col-wrapper">
            <div className="col-50">
              <h1 className="page-title">{post.title}</h1>
            </div>
            <div className="col-50 title-right" />
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="section">
        <div className="container">
          {/* Post info bar */}
          <div className="blog-page__info">
            <div className="blog-page__infotext">Posted on </div>
            <div className="blog-page__infotext">{post.date}</div>
          </div>

          {/* Rich-text body */}
          <div
            className="w-richtext"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* Back to blog link */}
          <div className="blog-page__back">
            <Link href="/blog" className="button is--outline is--dark">
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
