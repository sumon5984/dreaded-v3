const fetch = require('node-fetch');
const path = require('path');

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("Provide a valid URL to fetch!");

    try {
        const response = await fetch(text);
        const contentType = response.headers.get('content-type');

        if (!contentType) {
            const extname = path.extname(text).toLowerCase();
            if (extname === '.jpeg' || extname === '.jpg') {
                return handleImage(response);
            } else {
                return m.reply("The server did not return a content-type, and the file extension is unsupported.");
            }
        }

        console.log("Content-Type:", contentType);

        if (contentType.includes('application/json')) {
            const data = await response.json();
            return m.reply(JSON.stringify(data, null, 2));
        }

        if (contentType.includes('text/html')) {
            const html = await response.text();
            return m.reply(`Full HTML content:\n\n${html}`);
        }

        if (contentType.includes('image')) {
            return handleImage(response);
        }

        if (contentType.includes('video')) {
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

    async function handleImage(response) {
        const imageBuffer = await response.buffer();
        return client.sendMessage(
            m.chat,
            { image: imageBuffer, caption: "Here is your image!" },
            { quoted: m }
        );
    }
};