const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");

        let data = await fetchJson(`https://api.dreaded.site/api/ytdl/video?query=${text}`);
        let name = data.result.title;
        let audioLink = data.result.audioLink;

        await m.reply(`_Downloading ${name}_`);

        const proxy = {
            host: "13.36.104.85", // Replace with a valid proxy host
            port: 80, // Replace with the proxy port
            auth: {
                username: "", // Replace with proxy username (if required)
                password: "", // Replace with proxy password (if required)
            },
        };

        const response = await axios.get(audioLink, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
            proxy,
        });

        await client.sendMessage(m.chat, {
            document: Buffer.from(response.data),
            mimetype: "audio/mpeg",
            fileName: name,
        }, { quoted: m });
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};