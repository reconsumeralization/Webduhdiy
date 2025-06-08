// TODO: confirm version & license.
import * as React from 'react';
// TODO: confirm version & license.
import Head from 'next/head';

/* ---- embedded utilities ---- */
// None required; all logic is self-contained and React/next/head are imported above.

interface SEOHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export default function SEOHead({
  title,
  description = 'webduh documentation - Learn how to deploy and manage your applications with webduh platform',
  canonicalUrl,
  imageUrl = '/images/webduh-og-image.png',
  type = 'article',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SEOHeadProps) {
  const fullTitle = title.includes('webduh')
    ? title
    : `${title} - webduh Documentation`;
  const siteUrl = 'https://webduh.com';
  const fullCanonicalUrl = canonicalUrl || `${siteUrl}/docs`;
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${siteUrl}${imageUrl}`;

  // Generate structured data for documentation
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    image: fullImageUrl,
    url: fullCanonicalUrl,
    datePublished: publishedTime || new Date().toISOString(),
    dateModified: modifiedTime || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'webduh',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'webduh',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/webduh-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullCanonicalUrl,
    },
    articleSection: section || 'Documentation',
    keywords: tags.join(', '),
  };

  return (
    <Head>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={`webduh, deployment, hosting, documentation, ${tags.join(', ')}`}
      />
      <meta name="author" content="webduh" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="webduh Documentation" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@webduh" />
      <meta name="twitter:creator" content="@webduh" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />

      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Theme color */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//github.com" />

      {/* Preconnect for critical external resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </Head>
  );
}
