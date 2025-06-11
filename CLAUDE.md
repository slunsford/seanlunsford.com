# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm start` - Start development server with live reload
- `npm run build` - Build static site for production
- `npm run clean` - Remove built files from _site/

## Architecture

This is an Eleventy (11ty) static site generator project for Sean Lunsford's personal blog/website.

**Core Structure:**
- `/src/` - All source content and templates
- `/src/posts/` - Blog posts in Markdown format with YYYY-MM-DD-title.md naming
- `/src/_layouts/` - Nunjucks layout templates (base.njk, post.njk, page.njk)
- `/src/_includes/` - Reusable template partials
- `/src/_data/` - Global data files (site.yml contains site metadata, nav.yml for navigation)
- `/src/assets/` - Static assets (CSS, JS, images, fonts)
- `/_site/` - Generated output directory (git ignored)

**Eleventy Configuration:**
- Main config in `.eleventy.js` with custom plugins in `.eleventy.*.js` files
- Uses Nunjucks templating engine for HTML/Markdown processing
- Custom filters for date formatting, tag management, and text processing
- Plugins: RSS feeds, syntax highlighting, image optimization, post graph
- Auto-populates updated_date for posts in production using git timestamps

**Content Management:**
- Posts use frontmatter for metadata and are tagged as "posts"
- Link posts are collected separately via `data.link` frontmatter
- Tags are filtered to exclude system tags (all, nav, post, posts, pages)
- Supports footnotes and abbreviations in Markdown

**Deployment:**
- Hosted on Vercel with extensive redirect rules in vercel.json
- Mastodon federation redirects to external Mastodon instance
- Legacy URL redirects for old blog post structure