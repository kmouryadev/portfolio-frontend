import type { CDACollection } from './types';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT  = process.env.CONTENTFUL_ENVIRONMENT;

if (!SPACE_ID || !ACCESS_TOKEN) {
  throw new Error(
    '[Contentful] Missing credentials — set CONTENTFUL_SPACE_ID and ' +
    'CONTENTFUL_ACCESS_TOKEN in .env.local',
  );
}

const ENTRIES_BASE =
  `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries`;

export type QueryParams = Record<string, string | number | boolean>;

export async function cdaFetch<F = Record<string, unknown>>(
  params: QueryParams = {},
  revalidate = 60,
): Promise<CDACollection<F>> {
  const url = new URL(ENTRIES_BASE);

  url.searchParams.set('access_token', ACCESS_TOKEN!);
  url.searchParams.set('include', '2');

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(), { 
    next: { 
      revalidate 
    }
  });

  if (!response.ok) {
    throw new Error(
      `[Contentful] CDA ${response.status} ${response.statusText} — ${url.pathname}${url.search}`,
    );
  }

  return response.json() as Promise<CDACollection<F>>;
}
