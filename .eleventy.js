const { DateTime } = require("luxon");
const markdownItFootnote = require("markdown-it-footnote");
const yaml = require("js-yaml");

const postGraph = require('@rknightuk/eleventy-plugin-post-graph');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
    // Copy `assets/` to `_site/assets/`
    eleventyConfig.addPassthroughCopy("assets");

    // Copy `public/` to `_site/`
    eleventyConfig.addPassthroughCopy({ "public": "/" });

    // Watch content images for the image pipeline.
    eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpeg}");

    // App plugins
    eleventyConfig.addPlugin(require("./.eleventy.drafts.js"));
    eleventyConfig.addPlugin(require("./.eleventy.images.js"));

    // Official plugins
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight, {
        preAttributes: { tabindex: 0 }
    });
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    eleventyConfig.addPlugin(pluginBundle);

    eleventyConfig.addPlugin(postGraph, {
        sort: 'desc',
    })

    eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);
    eleventyConfig.addShortcode("currentMonth", () => `${new Date().getMonth() + 1}`);

    // Filters
    eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
        // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
        return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "EEEE, d LLLL yyyy");
    });

    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
    });

    // Get the first `n` elements of a collection.
    eleventyConfig.addFilter("head", (array, n) => {
        if(!Array.isArray(array) || array.length === 0) {
            return [];
        }
        if( n < 0 ) {
            return array.slice(n);
        }

        return array.slice(0, n);
    });

    // Return the smallest number argument
    eleventyConfig.addFilter("min", (...numbers) => {
        return Math.min.apply(null, numbers);
    });

    // Return all the tags used in a collection
    eleventyConfig.addFilter("getAllTags", collection => {
        let tagSet = new Set();
        for(let item of collection) {
            (item.data.tags || []).forEach(tag => tagSet.add(tag));
        }
        return Array.from(tagSet);
    });

    eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
        return (tags || []).filter(tag => ["all", "nav", "post", "posts", "pages"].indexOf(tag) === -1);
    });

    eleventyConfig.addDataExtension("yml, yaml", (contents) => yaml.load(contents));

    // Link posts collection
	eleventyConfig.addCollection("linkPosts", function (collection) {
		return collection.getAll().filter((item) => item.data.link);
	});

    // Customize Markdown library settings:
    eleventyConfig.amendLibrary("md", mdLib => {
        mdLib.enable("code");
        mdLib.use(markdownItFootnote);
    });

    return {
        // Control which files Eleventy will process
        // e.g.: *.md, *.njk, *.html, *.liquid
        templateFormats: [
            "md",
            "njk",
            "html",
            "liquid"
        ],

        // Pre-process *.md files with: (default: `liquid`)
        markdownTemplateEngine: "njk",

        // Pre-process *.html files with: (default: `liquid`)
        htmlTemplateEngine: "njk",

        dir: {
            input: "src",               // default: "."
            includes: "_templates",     // default: "_includes"
            data: "../_data",           // default: "_data"
            output: "_site"             // default: "_site"
        }
    }
}
