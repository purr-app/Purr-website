---
title: Responses
description: Read the result, inspect headers and timing, and keep the original response in view.
order: 2.5
scaffold: false
---

## Read the result

After you click **Send**, the response viewer shows the HTTP status, elapsed time, and response size. In Canvas layout, Purr expands the response and collapses the request details automatically.

A successful example request to `https://jsonplaceholder.typicode.com/posts/1` returns **200 OK** and JSON. An HTTP error status is still a response from the server; a connection failure means Purr could not complete the exchange.

## Inspect the body

Use **Pretty** for readable structured text or **Raw** to inspect the body without that formatting. **Hex** and **Base64** offer other representations of the same data. The available preview depends on the response content.

The copy control copies the response body. For a worked example with screenshots, see [Read the response](/docs/getting-started/#read-the-response).

## Inspect the exchange

- **Headers:** response headers, including content type and caching information.
- **Cookie:** cookies associated with the response.
- **Timeline:** timing and connection details for this execution.
- **Request:** the request associated with the execution.

The timeline describes one HTTP exchange. To explore backend spans across services, see [Jaeger tracing](/docs/tracing/).

## Focus on the data you need

Use the response query field with **jq** or **JSONPath** to inspect a portion of JSON. Purr supports a subset of these query languages; filtering does not change the original response.

For the first-request example, choose jq and enter `.id` to inspect the post's ID.

## Keep request and response visible

Use **Horizontal split** for request above response or **Vertical split** for request beside response. Drag the divider to adjust their sizes. These controls change the view without running the request again.

See [Choose a layout](/docs/getting-started/#choose-a-layout) for a short video, or return to [HTTP requests](/docs/requests/).
