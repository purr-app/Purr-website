---
title: Workspaces and environments
description: Keep a project's requests together and switch the values they use.
order: 1.5
scaffold: false
---

## Workspaces keep a project together

A workspace contains your saved requests, folders, variables, and environments. Purr creates **Personal** on first launch, so you can start sending requests immediately.

Use the workspace selector in the header to switch workspaces. The Documents sidebar shows the selected workspace's folders and requests; History shows its previous executions.

Folders group related requests within a workspace. For example, put login and account requests in an **Accounts** folder. The [Getting started guide](/docs/getting-started/#keep-related-requests-in-a-folder) walks through creating a folder and moving a request into it.

## Reuse a value with a variable

Open **Variables** from the header to manage values used by requests. A workspace variable is useful for a value shared across the project, such as a base URL.

For the Getting started example, create a static workspace variable named `base_url` with this value:

```text
https://jsonplaceholder.typicode.com
```

Then use it in a request URL:

```text
{{base_url}}/posts/1
```

Purr resolves the variable when you send the request. The saved request keeps the template, so you can change the value without editing every URL.

## Switch values with environments

An environment supplies a set of variables for the current workspace. Use environments when the same requests need different values for development, staging, or production.

Choose **New environment** from the environment selector, give it a name, and save it. Select an environment from the header before sending a request. **No environment** uses the available workspace values without an environment override.

An enabled environment variable overrides a workspace variable with the same name. For example, a staging environment can supply a different `base_url` while your request remains `{{base_url}}/posts/1`.

## Go further

Static variables hold values you enter. [Dynamic variables](/docs/variables/) can extract a value from a saved request's JSON response and reuse it in another request.

Next, explore [HTTP requests](/docs/requests/) to configure parameters, headers, authentication, and bodies.
