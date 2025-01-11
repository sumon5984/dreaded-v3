const fetch = require('node-fetch');

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("Provide a valid URL to fetch!");

    try {
        const response = await fetch(text);

        if (response.headers.get('content-type').includes('application/json')) {
            const data = await response.json();
            return m.reply(JSON.stringify(data, null, 2));
        }

        if (response.headers.get('content-type').includes('text/html')) {
            const html = await response.text();
            return m.reply(`HTML snippet: ${html.substring(0, 500)}...`);
        }

        if (response.headers.get('content-type').includes('image')) {
            const imageBuffer = await response.buffer();
            return client.sendMessage(
                m.chat,
                { image: imageBuffer, caption: "Here is your image!" },
                { quoted: m }
            );
        }

        if (response.headers.get('content-type').includes('video')) {
            const videoBuffer = await response.buffer();
            return client.sendMessage(
                m.chat,
                { video: videoBuffer, caption: "Here is your video!" },
                { quoted: m }
            );
        }

        return m.reply("The content type is unsupported or could not be determined.");
    } catch (error) {
        console.error(error);
        return m.reply("An error occurred while fetching the URL.");
    }
};