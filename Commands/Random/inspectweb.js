const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

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

        await m.reply(`Full HTML Content:\n\n${html}`);

        if (cssFiles.length === 0) {
            await m.reply("No CSS files linked in the HTML. Maybe the styles are embedded directly in the HTML?");
        } else {
            for (const cssFile of cssFiles) {
                const cssUrl = new URL(cssFile, text).href;
                const cssResponse = await fetch(cssUrl);
                const cssContent = await cssResponse.text();
                await m.reply(`CSS from ${cssUrl}:\n\n${cssContent.substring(0, 500)}...`);
            }
        }

        if (jsFiles.length === 0) {
            await m.reply("No JavaScript files linked in the HTML. Maybe the scripts are embedded directly in the HTML?");
        } else {
            for (const jsFile of jsFiles) {
                const jsUrl = new URL(jsFile, text).href;
                const jsResponse = await fetch(jsUrl);
                const jsContent = await jsResponse.text();
                await m.reply(`JavaScript from ${jsUrl}:\n\n${jsContent.substring(0, 500)}...`);
            }
        }

      
        const url = new URL(text);
        const ipResponse = await fetch(`https://ipinfo.io/${url.hostname}/json`);
        const ipData = await ipResponse.json();

        await m.reply(`IP Address: ${ipData.ip}\nHost: ${ipData.org}\nLocation: ${ipData.city}, ${ipData.region}, ${ipData.country}`);

    } catch (error) {
        console.error(error);
        return m.reply("An error occurred while fetching the website content.");
    }
};