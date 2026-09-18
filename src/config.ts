const external = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Public product URLs must use HTTPS.');
  return url.href;
};
export const links = {
  github: external(import.meta.env.PUBLIC_GITHUB_URL, '/github/'),
  download: external(import.meta.env.PUBLIC_DOWNLOAD_URL, '/download/'),
  license: external(import.meta.env.PUBLIC_LICENSE_URL, '/license/'),
};
export const description =
  'A focused, local-first HTTP and GraphQL API client for macOS. Send requests, inspect responses, follow Jaeger traces, and keep your workflow focused.';
