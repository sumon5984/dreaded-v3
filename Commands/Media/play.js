const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");
        
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;

        const response = await axios.get(`https://api.dreaded.site/api/ytdl/audio?url=${urlYt}`);
        const data = response.data;

        if (!data || !data.title || !data.audioUrl) {
            return m.reply("Failed to fetch audio details from the API.");
        }

        const { title: name, audioUrl: audio } = data;

        await m.reply(`_Downloading ${name}_`);

        await client.sendMessage(
            m.chat,
            {
                document: { url: audio },
                mimetype: "audio/mpeg",
                fileName: `${name}.mp3`
            },
            { quoted: m }
        );
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};