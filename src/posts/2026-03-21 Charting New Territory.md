---
title: Charting New Territory
date: 2026-03-Sa'T'17:24:00177409404000017740940400001774094040000
draft: false
link: https://uncharted.seanlunsford.com/
description: Announcing Uncharted, an Eleventy plugin for generating charts from CSVs
slug: uncharted
tags: Uncharted
---
Today I'm publishing the 1.0 release of my first [Eleventy](https://www.11ty.dev/) plugin, [Uncharted](https://uncharted.seanlunsford.com/). It's a plugin for creating charts on the [static site generator](https://en.wikipedia.org/wiki/Static_site_generator) I use for my blog and a number of other websites. It takes data from CSV files, [JSON in the data directory](https://www.11ty.dev/docs/data-global/), or the [YAML front matter](https://www.11ty.dev/docs/data-frontmatter/) for the post or page. It generates static HTML and CSS to render [a growing number of types of charts](https://uncharted.seanlunsford.com/chart-types/), with a limited amount of interactivity (i.e., hover effects and tooltips). Here's an example:

{% chart 'claude-adoption' %}

Because they're HTML + CSS instead of images, they can adapt and resize to fit the page and device they're on, be responsive to light/dark mode, and be styled to match the website—and without running client-side Javascript.

The chart above is relevant to Uncharted for multiple reasons. The genesis of the project was a two-page Wrapped-style website I put together for work to document what I did last year, based primarily on GitHub data. Since the C-Suite is very interested in any applications of AI within the company, I also added some numbers and the above chart to demonstrate my adoption of [Claude Code](https://claude.com/product/claude-code), which by the end of the year had become a key part of my development workflow.

I developed that website itself with Claude Code, first as just a couple of HTML files and a stylesheet. Then I had the idea to rebuild it in Eleventy, which would also make adding pages a lot easier next year and beyond. I'd thought about trying to develop some sort of charts plugin for Eleventy in the past; once I'd gone through implementing a bunch of CSS-based charts with Claude for this, it was just a matter of asking Claude to use those charts as the basis of a new plugin and then migrate the site over.

Once I had a 0.1, my next use case (and the one I'd had in mind before the Wrapped project) was to move my [Tidy Tuesday](https://tidytuesday2025.seanlunsford.com/) site to Eleventy. I was increasingly unsatisfied with the framework I'd been using before—one that is specifically designed for BI (business intelligence—i.e., dashboards). I'd been very impressed with it when I first came to it, but my hangups over time were more to do with the stack. It was built on a different SSG, not Eleventy. I was constantly getting alerts for vulnerabilities in the dependencies, I kept having compatibility issues with different packages and the things I was trying to connect it to, and I had much less flexibility to customize the website.

Meanwhile, pretty much every new site I start now I do in Eleventy, and I really just wanted my Tidy Tuesday site to be on that same stack. So I worked with Claude Code to do [just that](https://tidytuesday.seanlunsford.com/). I started fresh with the first couple datasets in January, and have built out Uncharted as I've needed new chart types or other features for each week since.

At whatever point I added a [Sankey diagram](https://en.wikipedia.org/wiki/Sankey_diagram) to the available chart types, I also went back and replaced the chart on [a recent(ish) post](/2025/tuesdays-and-travels/) here, which had just been a screenshot from my old Tidy Tuesday site before.

While working on this I've had the privilege of interacting with [Bob Monsour](https://indieweb.social/@bobmonsour) of [11tybundle](https://11tybundle.dev/) fame. He used a prerelease version to work on a new [Insights](https://11tybundle.dev/insights/) page, and while he was drafting that he opened a number of issues on the [GitHub repo](https://github.com/slunsford/uncharted) that we went back and forth on to debug. It was really helpful to get some external feedback during early development and very rewarding to see Uncharted in the wild so soon after I started the project.

The last few weeks I've been holding myself to [no new features](https://x.com/_davidsmith/status/1561736141577019394) as I've been trying to get what I have all buttoned up and ready to release as a solid v1 with (hopefully) minimal bugs. It's been basically done, just waiting on being tested to the point that I felt ready to release it—and on this post being written. Now that [1.0.0](https://www.npmjs.com/package/eleventy-plugin-uncharted/v/1.0.0?activeTab=versions) is out, I can go back to adding new stuff again.

So if you happen to be a fellow soul with Eleventy under the hood of your website, go run

```sh
npm install eleventy-plugin-uncharted
```

Show me what you come up with.
