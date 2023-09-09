module.exports = function(eleventyConfig) {
    // Copy `assets/` to `_site/assets/`
    eleventyConfig.addPassthroughCopy("assets");

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
