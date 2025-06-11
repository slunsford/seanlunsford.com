---
title: Colophon
---
This website is built with [Eleventy](https://www.11ty.dev/) and deployed on [Vercel](https://vercel.com/). The source code is on [GitHub](https://github.com/slunsford/seanlunsford.com).

[Email subscriptions](/subscribe/) are powered by [Buttondown](https://buttondown.email/refer/seanlunsford).

Previous versions of this site have been on self-hosted [Ghost](https://ghost.org/) and, before that, [WordPress](https://wordpress.com/).

## Dependencies

Popover footnotes are based on [bigfoot.js](https://github.com/lemonmade/bigfoot).

{% set currentMonth %}{% currentMonth %}{% endset -%}

{% if currentMonth == 12 -%} The `<snow-fall>` web component is by Zach Leatherman. {%- endif %}

The post graph at the bottom of the [archive](/archive/) and [tag](/tag/technology/) pages is Robb Knight’s [Eleventy Post Graph](https://postgraph.rknight.me/) plugin.

## Typography

The web fonts you see are [Valkyrie](https://mbtype.com/fonts/valkyrie), [Concourse](https://mbtype.com/fonts/concourse), and [MonoLisa.](https://www.monolisa.dev/)