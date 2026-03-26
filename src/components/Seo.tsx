import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mergeSeoMetadata, type SeoOverride } from '../lib/seo';

type SeoProps = SeoOverride;

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function removeHeadTag(selector: string) {
  document.head.querySelector(selector)?.remove();
}

export default function Seo({
  title,
  description,
  canonicalPath,
  robots,
  type,
  imageUrl,
  imageAlt,
  twitterCard,
}: SeoProps) {
  const location = useLocation();

  useEffect(() => {
    const metadata = mergeSeoMetadata(location.pathname, {
      title,
      description,
      canonicalPath,
      robots,
      type,
      imageUrl,
      imageAlt,
      twitterCard,
    });
    const canonicalUrl = new URL(metadata.canonicalPath, window.location.origin).toString();

    document.title = metadata.title;

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: metadata.description,
    });

    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: metadata.robots,
    });

    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: metadata.type,
    });

    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: 'B2W',
    });

    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: metadata.title,
    });

    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: metadata.description,
    });

    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: metadata.twitterCard,
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: metadata.title,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metadata.description,
    });

    if (metadata.imageUrl) {
      upsertMeta('meta[property="og:image"]', {
        property: 'og:image',
        content: metadata.imageUrl,
      });

      upsertMeta('meta[name="twitter:image"]', {
        name: 'twitter:image',
        content: metadata.imageUrl,
      });

      if (metadata.imageAlt) {
        upsertMeta('meta[property="og:image:alt"]', {
          property: 'og:image:alt',
          content: metadata.imageAlt,
        });

        upsertMeta('meta[name="twitter:image:alt"]', {
          name: 'twitter:image:alt',
          content: metadata.imageAlt,
        });
      } else {
        removeHeadTag('meta[property="og:image:alt"]');
        removeHeadTag('meta[name="twitter:image:alt"]');
      }
    } else {
      removeHeadTag('meta[property="og:image"]');
      removeHeadTag('meta[property="og:image:alt"]');
      removeHeadTag('meta[name="twitter:image"]');
      removeHeadTag('meta[name="twitter:image:alt"]');
    }

    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    });
  }, [canonicalPath, description, imageAlt, imageUrl, location.pathname, robots, title, twitterCard, type]);

  return null;
}
