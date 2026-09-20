import type { APIRoute } from 'astro';

const content = `# Purr

> Purr is a focused, local-first desktop API client for HTTP and GraphQL on macOS.

Purr stores workspaces locally, supports HTTP and GraphQL workflows, imports cURL and OpenAPI 3, filters responses with jq and JSONPath, and integrates with Jaeger for distributed tracing.

## Product

- [Home](https://usepurr.com/): Product overview
- [Download](https://usepurr.com/download/): Current macOS download and installation notes
- [Changelog](https://usepurr.com/changelog/): Published product releases
- [Privacy](https://usepurr.com/privacy/): Website privacy information

## Documentation

- [Documentation](https://usepurr.com/docs/): Documentation index
- [Getting started](https://usepurr.com/docs/getting-started/)
- [Requests](https://usepurr.com/docs/requests/)
- [GraphQL](https://usepurr.com/docs/graphql/)
- [Variables](https://usepurr.com/docs/variables/)
- [OpenAPI](https://usepurr.com/docs/openapi/)
- [Tracing and Jaeger](https://usepurr.com/docs/tracing/)
- [Encryption](https://usepurr.com/docs/encryption/)

## Source

- [Public source repository](https://github.com/purr-app/Purr)
`;

export const GET: APIRoute = () =>
  new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
