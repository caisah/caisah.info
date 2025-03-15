---
title: Emacs - Add ts-lit-plugin to eglot config
excerpt: Learn how to add lit ts lsp plugin to eglot config
publishDate: 'Mar 15 2025'
seo:
  title: Emacs - Add ts-lit-plugin to eglot config
  description: Learn how to add lit ts lsp plugin to eglot config in Emacs
---

To configure lsp (eglot) to use the [ts-lit-plugin](https://github.com/runem/lit-analyzer/tree/master/packages/ts-lit-plugin) in [Emacs](https://www.gnu.org/software/emacs/), set the eglot server to be [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server) and configure the plugin.


```lisp
(add-to-list 'eglot-server-programs '((js-mode js-ts-mode tsx-ts-mode typescript-ts-mode typescript-mode) .
             ("typescript-language-server" "--stdio" :initializationOptions
                                           (:plugins [(:name "ts-lit-plugin" :location "[/path/to/ts-lit-plugin]")]))))

```

You have to prior install the plugin globally:

```sh
npm i -g ts-lit-plugin
```
