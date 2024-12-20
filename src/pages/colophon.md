---
title: Colophon
---
This website is built with [Eleventy](https://www.11ty.dev/) and deployed on [Cloudflare Pages](https://pages.cloudflare.com/). The source code is on [GitHub](https://github.com/slunsford/seanlunsford.com).

[Email subscriptions](/subscribe/) are powered by [Buttondown](https://buttondown.email/refer/seanlunsford).

Previous versions of this site have been on self-hosted [Ghost](https://ghost.org/)[^ghost] and, before that, [WordPress](https://wordpress.com/).[^wp]

## Dependencies
Popover footnotes (like the ones above) are powered by [bigfoot.js](https://github.com/lemonmade/bigfoot).

{{ snowfallEnabled }}

{%- set currentMonth %}{% currentMonth %}{% endset %}
{% if currentMonth == 12 -%}
The `<snow-fall>` web component is by [Zach Leatherman](https://github.com/zachleat/snow-fall/blob/main/snow-fall.js).
{%- endif %}

The post graph at the bottom of the [archive](/archive/) and [tag](/tag/technology/) pages is Robb Knight’s [Eleventy Post Graph](https://postgraph.rknight.me/) plugin.

## Typography
Web fonts are by [ArrowType](https://www.arrowtype.com/):
- [Name Sans](https://www.arrowtype.com/name-sans)
- [Name Mono](https://www.arrowtype.com/name-mono)
- [Lang](https://www.arrowtype.com/lang)

Fallback fonts use [Modern Font Stacks](https://modernfontstacks.com/).

[^ghost]: This current design is an evolution of the custom theme I wrote for my Ghost blog.

[^wp]: At some point, I upgraded to the plan that let me inject my own CSS. Elements of that customized theme served as inspiration [when I developed the new theme](/2018/seanlunsford-com-has-moved/) for Ghost.
