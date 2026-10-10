import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs');
  const records = await Promise.all(
    entries.map(async (entry) => {
      const { headings } = await render(entry);
      const text = (entry.body || '')
        .replace(/^import\s.+$/gm, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[`#*_]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      return {
        title: entry.data.title,
        description: entry.data.description,
        url: `/docs/${entry.id}/`,
        text,
        headings: headings
          .filter((h) => h.depth === 2 || h.depth === 3)
          .map(({ text, slug }) => ({ text, slug })),
      };
    }),
  );
  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
