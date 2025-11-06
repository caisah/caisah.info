---
title: Configure typescript lsp server for custom exports
excerpt: How to configure javascript/typescript language server for custom exports
publishDate: 'Nov 06 2025'
seo:
  title: Configure typescript lsp server for custom exports
  description: How to configure javascript/typescript language server for custom exports
---

I've encountered a problem with typescript language server configuration which was not working as it should.

If some third party package would have in `package.json` something like:

```json
"exports": {
        "./*": {
            "types": "./dist-types/exports/*",
            "default": "./exports/*"
        }

```
I could not get it to make "jump to definition" work. By default the `lsp` server could not load the files mapped to `exports` dir.

The fix was having a `tsconfig.json` file in my own project with "compilerOptions" correctly configured:

```json
"compilerOptions": {
    "moduleResolution": "nodenext",
    "module": "nodenext",
    "allowJs": true
}
```
