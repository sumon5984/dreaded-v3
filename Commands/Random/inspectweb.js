const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

module.exports = async (context) => {
    const { m, text } = context;

    if (!text) return m.reply("Provide a valid URL to fetch!");

    if (!/^https?:\/\//i.test(text)) {
        return m.reply("Please provide a URL starting with http:// or https://");
    }

    try {
        const response = await fetch(text);
        const html = await response.text();

        const $ = cheerio.load(html);

        const cssFiles = [];
        $('link[rel="stylesheet"]').each((i, element) => {
            const href = $(element).attr('href');
            if (href) cssFiles.push(href);
        });

        const jsFiles = [];
        $('script[src]').each((i, element) => {
            const src = $(element).attr('src');
            if (src) jsFiles.push(src);
        });

        await m.reply(`HTML Content:\n\n${html.substring(0, 500)}...`);

        for (const cssFile of cssFiles) {
            const cssUrl = new URL(cssFile, text).href;
            const cssResponse = await fetch(cssUrl);
            const cssContent = await cssResponse.text();
            await m.reply(`CSS from ${cssUrl}:\n\n${cssContent.substring(0, 500)}...`);
        }

        for (const jsFile of jsFiles) {
            const jsUrl = new URL(jsFile, text).href;
            const jsResponse = await fetch(jsUrl);
            const jsContent = await jsResponse.text();
            await m.reply(`JavaScript from ${jsUrl}:\n\n${jsContent.substring(0, 500)}...`);
        }

    } catch (error) {
        console.error(error);
        return m.reply("An error occurred while fetching the website content.");
    }
};