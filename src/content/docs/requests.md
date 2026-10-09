---
title: HTTP requests
description: Build the request, send it, and inspect what came back.
order: 2
---

## Compose and inspect

Choose the HTTP method and enter the URL in the request editor. Use **Params**, **Headers**, **Auth**, and **Body** to configure the request, then click **Send**.

Start with the [first-request walkthrough](/docs/getting-started/#send-your-first-request), or see [Responses](/docs/responses/) to inspect the result.

## Response filtering

Filter JSON responses in place with jq or JSONPath. Keep the original response intact and inspect only the data you care about.

[See response filtering](/#filtering).

## Request timeline

See connection time, TTFB, download time, headers, redirects, TLS details, and more without leaving the response.

The request timeline describes the lifecycle of a single request. To follow the spans behind a response, explore [Jaeger tracing](/docs/tracing/).
