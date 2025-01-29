---
title: Deno - jump to definition in jsr.io package
excerpt: Learn how you can jump to definition for a deno package installed from jsr.io
publishDate: 'Jan 29 2025'
tags:
  - Guide
seo:
  title: Deno - jump to definition in jsr.io package
  description: Learn how you can jump to definition for a deno package installed from jsr.io
---

Recently I started playing with [Deno](https://deno.com/) and using its lsp implementation. The latest 2.x versions work great.

A small issue I've encountered was when trying to jump to definition for packages installed from [jsr.io](https://jsr.io/). These did not work because the package was not cached locally. So when trying to see the actual implementation of a symbol, I would be following an empty file. Wierdly enough this did not happen for packages installed from npm. 🤔 (I guess because these were already cached locally in the $DENO_DIR).

To solve the issue, I had to first cache the packages by adding to [deno.json](https://docs.deno.com/runtime/fundamentals/configuration/):

```json
{"vendor": true}
```

and re-caching:

```sh
# clear the cache
deno cache --reload main.ts
# re-cache
deno cache main.ts

```

This will create two local folders: `vendor`(for jsr.io) and `node_modules`(for npm) containing the dependencies and won't download those on every run.

Now every time I tried to jump to definition for a symbol, the correct file was followed.

More info on *vendor* option can be found in the [official doc](https://docs.deno.com/runtime/fundamentals/modules/#vendoring-remote-modules).
