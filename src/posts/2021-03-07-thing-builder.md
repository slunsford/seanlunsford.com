---
title: Thing Builder
slug: thing-builder
date: 2021-03-07T15:17:58.000Z
date_updated: 2021-03-27T19:45:59.000Z
featured_image: "/assets/img/thing-builder.png"
featured_image_alt: "A screenshot of the first few blocks of the Thing Builder shortcut on an iPad"
categories: "Technology"
---

Today I’m taking the wraps off a side project I started almost three years ago. It started with me wishing for project templates in my task manager, [Things](https://culturedcode.com/things/). At the time, I was using [Drafts](https://getdrafts.com/) a lot for text automation, and I found a couple different user-created text parsers for Things in the [Action Directory](https://actions.getdrafts.com/). Inspired by these, I wanted something more Markdown-like, and as I thought about it, something in Shortcuts and not tied to a single third-party app.[^1]

I created the [Thing Builder](https://gist.github.com/slunsford/d19956fc8fbbbd9a9959b30275d1ef9e), a [250-action](https://f001.backblazeb2.com/file/seanlunsford/thing-builder.png) shortcut that accepts text using a particular markup, which can be used to define and create a new Things project with all its associated tasks and dates, or to batch-add tasks to existing projects or areas. In addition to using the Markdown syntax for headings and bullets, I chose a handful of symbols, which can prefix a string of text to mark it as a list, date, tag, or note.

I did this in July 2019, but I decided to sit on it for a while before sharing it—mainly to actually put the tool through its paces and iron out any wrinkles. I’d also run into a bug with one of Shortcuts’ actions while initially working on this. (I was running an iOS beta, after all.) I found a workaround for the time being, but I did want to come back and use the more elegant solution whenever that got taken care of.[^2]

This has been longer of “a while” than I expected—but in the meantime, I’ve used it a lot, made a few tweaks, and built several other shortcuts that themselves call the Thing Builder to generate a project. I have several templates for work that I use on a regular basis. This outlasted another fling with the [Bullet Journal](https://bulletjournal.com/) and was waiting for me when I came back to the warm embrace of Things in January. At some point I’d seen that that buggy action was working again, so I’d had swapping those actions out on my to-do list for some time, along with writing documentation and sharing the shortcut (all in a Things project, of course). Yesterday that caught my eye, I made the updates, and then I went ahead with writing docs. And here we are.

If you’re looking for a way to create reusable project templates for Things—or just add a bunch of tasks from a text editor—you can find a link to download the shortcut and an explanation of the syntax [in the documentation](https://gist.github.com/slunsford/d19956fc8fbbbd9a9959b30275d1ef9e).

[^1]: Though there were plenty of times during development where I would’ve rather been working with code in a text editor for something of this scale, using Shortcuts turned out to be a good move: I’ve long since moved on from Drafts, but the shortcut I built is alive and well, and accessible anywhere through the iOS share sheet.

[^2]: It was the “Get Group from Matched Text” action, for extracting sub-patterns from text matched with a regular expression. In those cases, I ended up using the “Match Pattern” action again to match within the match.
