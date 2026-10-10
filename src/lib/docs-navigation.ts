export const docsGroups = [
  {
    id: 'getting-started',
    title: 'Getting started',
    pages: ['getting-started', 'workspaces-and-environments'],
  },
  { id: 'requests', title: 'Requests', pages: ['requests', 'graphql'] },
  { id: 'workflows', title: 'Workflows', pages: ['variables', 'openapi'] },
  { id: 'debugging', title: 'Debugging', pages: ['responses', 'tracing'] },
  { id: 'security', title: 'Security', pages: ['encryption'] },
];

export function orderDocs<T extends { id: string; data: { order: number } }>(entries: T[]) {
  const ids = docsGroups.flatMap((group) => group.pages);
  return [...entries].sort((a, b) => {
    const ai = ids.indexOf(a.id);
    const bi = ids.indexOf(b.id);
    return (ai < 0 ? ids.length : ai) - (bi < 0 ? ids.length : bi) || a.data.order - b.data.order;
  });
}
