

## Problem

This is a fundamental limitation of single-page applications (SPAs). Your `index.html` contains only `<div id="root"></div>` — no `<a href>` links exist in the raw HTML. All navigation is rendered client-side by React after JavaScript executes. SEO crawlers that don't render JavaScript see an empty page with zero internal links.

## What I can fix

Add a `<noscript>` navigation block in `index.html` that contains plain HTML `<a>` links to all public marketing pages. This serves two purposes:

1. **Crawlers that don't execute JS** (including Screaming Frog in default mode) will see real `<a href>` links in the raw HTML
2. **Google's crawler** does render JS, so it already sees your links — but having them in raw HTML is a best-practice signal

## What I cannot fix

True server-side rendering (SSR) is not possible in this stack (Vite + React SPA). However, between the sitemap.xml, the `<noscript>` fallback links, and Google's JS rendering, your pages should be discoverable and indexable.

## Changes

**`index.html`** — Add a `<noscript>` block inside `<body>` before the root div, containing links to all public pages:

```html
<noscript>
  <nav>
    <a href="https://www.things-done.app/">Home</a>
    <a href="https://www.things-done.app/features">Features</a>
    <a href="https://www.things-done.app/pricing">Pricing</a>
    <a href="https://www.things-done.app/blog">Blog</a>
    <a href="https://www.things-done.app/about">About</a>
    <a href="https://www.things-done.app/legal">Terms & Privacy</a>
    <a href="https://www.things-done.app/auth">Sign In</a>
  </nav>
</noscript>
```

Also update the existing `<link rel="canonical">` and OG URLs from `things-done.app` to `www.things-done.app` to match your sitemap and SEOHead config.

