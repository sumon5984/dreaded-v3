const fs = require("fs");
const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) {
            return m.reply("What video do you want to download?");
        }

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No videos found!");
        }

        const urlYt = videos[0].url;

        const primaryData = await fetchJson(`https://api.dreaded.site/api/ytdl/video?url=${urlYt}`);
        if (!primaryData.success || !primaryData.result || !primaryData.result.url) {
            throw new Error("Invalid response from primary API");
        }

        const videoUrl = primaryData.result.url;
        const name = primaryData.result.title;

        await m.reply(`_Downloading ${name}_. . .`);

        const response = await fetch(videoUrl);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }

        const filePath = `/tmp/${name}.mp4`;
        const fileStream = fs.createWriteStream(filePath);

        
        response.body.pipe(fileStream);

       
        await new Promise((resolve, reject) => {
            fileStream.on("finish", resolve);
            fileStream.on("error", reject);
        });

        await client.sendMessage(
            m.chat,
            {
                video: fs.readFileSync(filePath),
                mimetype: "video/mp4",
                caption: name,
                fileName: `${name}.mp4`,
            },
            { quoted: m }
        );

        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("Error:", error.message);
        await m.reply("Failed to download or send the video." + error);
    }
};