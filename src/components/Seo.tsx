import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
};

const SITE_NAME = 'B2W';

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

export default function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    const absoluteTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = window.location.href;

    document.title = absoluteTitle;

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    });

    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website',
    });

    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    });

    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: absoluteTitle,
    });

    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });

    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary',
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: absoluteTitle,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });

    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    });
  }, [description, title]);

  return null;
}
