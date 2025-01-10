const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const path = require('path');

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;

        try {
            let data = await fetchJson(`https://api.dreaded.site/api/ytdl2/audio?url=${urlYt}`);
            if (!data || !data.result || !data.result.downloadUrl) {
                throw new Error("Invalid response from primary API");
            }

            const { title: name, downloadUrl: audioUrl } = data.result;

            const audioBuffer = await axios.get(audioUrl, { responseType: 'arraybuffer' });

            const tempInputPath = path.join(__dirname, `${name}_temp.mp3`);
            fs.writeFileSync(tempInputPath, audioBuffer.data);

            const reencodedOutputPath = path.join(__dirname, `${name}_reencoded.mp3`);

            await reencodeAudio(tempInputPath, reencodedOutputPath);

            await m.reply(`_Downloading ${name}_`);
            await client.sendMessage(
                m.chat,
                {
                    document: { url: `file://${reencodedOutputPath}` },
                    mimetype: "audio/mpeg",
                    fileName: `${name}.mp3`,
                },
                { quoted: m }
            );

            fs.unlinkSync(tempInputPath);
            fs.unlinkSync(reencodedOutputPath);

        } catch (primaryError) {
            console.error("Primary API failed:", primaryError.message);
            m.reply("Download failed from primary source.");

            if (primaryError.response) {
                console.error("API Error Details:", primaryError.response.data);
                console.error("Status Code:", primaryError.response.status);
            }

            try {
                const fallbackResponse = await axios.get(`https://api.dreaded.site/api/ytdl/audio?url=${urlYt}`);
                const fallbackData = fallbackResponse.data;

                if (!fallbackData || !fallbackData.title || !fallbackData.audioUrl) {
                    throw new Error("Invalid response from fallback API");
                }

                const { title: name, audioUrl: audio } = fallbackData;

                await m.reply(`_Downloading ${name}_`);
                await client.sendMessage(
                    m.chat,
                    {
                        document: { url: audio },
                        mimetype: "audio/mpeg",
                        fileName: `${name}.mp3`,
                    },
                    { quoted: m }
                );
            } catch (fallbackError) {
                console.error("Fallback API failed:", fallbackError.message);
                m.reply("Download failed from fallback source.");
                if (fallbackError.response) {
                    console.error("API Error Details:", fallbackError.response.data);
                    console.error("Status Code:", fallbackError.response.status);
                }
            }
        }

    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};

function reencodeAudio(inputPath, outputPath, bitrate = '128k') {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec('libmp3lame')
            .audioBitrate(bitrate)
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .run();
    });
}