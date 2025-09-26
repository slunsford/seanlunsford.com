---
title: Tidy Tuesdays
date: 2025-09-21T23:49:24+00:00
tags:
  - Data
  - Technology
  - Travel
---
I started this draft at 5:30 in the morning on Monday, waiting to board a flight in Delhi. I’m picking it back up to (hopefully) publish it as I wait for another flight at Heathrow, after three days at a [data conference](https://www.bigdataldn.com/) in London. This was my second time at this particular conference, and the fourth year running I’ve gone to a data conference in London in the fall.

This year was the first time I had to request an ETA for entry into the UK—not an *estimated time of arrival*, but an *electronic travel authorization*. Some weeks ago I downloaded the UK ETA app and used it to submit a scan of my passport, a scan of my face, and other information. I got the approval in my inbox almost immediately, but it was an extra step where in the past I’d been able to just land in the UK, walk through their automated gates with my passport, and be in. My arrival this year was the same experience, but only because my passport with my ETA was already in their system for this next year.

Why am I writing about data and passports? Well, fittingly, I just did more recreational data visualization on the topic as part of [Tidy Tuesday](https://github.com/rfordatascience/tidytuesday/blob/main/README.md), a weekly data project I’ve started participating in the month or so. The one from a couple weeks ago was on the [Henley Passport Index](https://www.henleyglobal.com/passport-index/about), which measures the strength of passports based on visa-free access to other countries. The contributor of this dataset was inspired by [an article](https://edition.cnn.com/2025/07/22/travel/world-most-powerful-passports-july-2025) about the strength of US passports declining. The US passport is still #10 on the rankings, but that’s down from #1 in 2014. So that news is pretty relevant to me, one of a generation of TCKs and now digital nomads who grew up thinking the world was our oyster.

I could have done a visualization tracking the change in rankings over time as addressed in that article, but as I explored this dataset, I became more intrigued in looking at the data as a two-way street—essentially, how does access to a country for other nationalities correlate to the access granted to its nationals abroad? It took a few attempts to figure out how best to represent that, but ultimately what I landed on was what’s called a Sankey chart—typically used to represent flow. I set it up to show the breakdown of visa requirement categories as designated in the data—for entering a given country on the left side, and for passport holders entering others on the right. [The page on my Tidy Tuesday site](https://tidytuesday.seanlunsford.com/2025-09-09/) has an interactive version with a dropdown menu to pick the country. Here’s the US:

![Sankey diagram titled 'Oyster Quotient: Visa requirements to and from United States' showing the flow of visa requirements between the United States and other countries. On the left side, the largest flow shows 'Visa Required' for foreign nationals traveling to the US, while on the right side, the largest flow shows 'Visa-free Access' for US citizens traveling abroad. Other categories include Electronic Travel Authorization, Online Visa, and Visa on Arrival options. The visualization illustrates the asymmetric nature of visa requirements, where most foreign nationals need visas to enter the US, but US citizens enjoy visa-free access to most international destinations.](/images/oyster-quotient.png)

So I can see myself in that little slice of US passport holders applying for ETAs in one of 10 countries. But this also clearly shows what I was already pretty sure I knew: that while a majority of countries (at least for now) allow US citizens to visit with no visa at all—a privilege that I’ve taken advantage of plenty—an even larger majority of nationalities are required to apply for a visa to enter the United States. The number allowed to arrive visa-free? Four.

I wonder how many Americans would even think twice about this imbalance. Or how many would defend it?

This also doesn’t account for the difficulty of attaining visas, where visas are required.[^h1b]

Anyway, I’d been wanting to write about these Tidy Tuesday projects since I started trying to keep up with them, and then this particular one hit pretty close to home for me. There are [a few other datasets up there](https://tidytuesday.seanlunsford.com/) too—including [last week](https://tidytuesday.seanlunsford.com/2025-09-16) where I tried to look at bread (or more technically wheat/flour) and rice across cuisines.

A closing reflection: I mentioned growing up in a world that seemed increasingly connected and closer together—where “globalization” was only considered a positive word, bringing with it a literal world of opportunities. That starry-eyed optimism is starting to show some cracks in the cold light of reality—as countries around the world seem to be pulling away from that glimmer of a more interconnected globe. I hope something of it survives long enough to give my kids the global perspective I had the privilege of growing up with, and have always wanted for them.

[^h1b]: Like, say, an H-1B visa. Just to name a totally random example.