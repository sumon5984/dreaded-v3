module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) return m.reply("No songs found!");

        const chosenVideo = videos[0];
        const { title, thumbnail, duration, author, url } = chosenVideo;

        const downloadOptionsMessage = {
            caption: `*${title}*\n\nBy: ${author}\nDuration: ${duration}\nDownload Link: ${url}\n\nChoose download format:\n1. Audio\n2. Document`,
            image: { url: thumbnail },
        };

        const sentMessage = await client.sendMessage(m.chat, downloadOptionsMessage, { quoted: m });
        const messageKey = sentMessage.key;

        const handler = async ({ messages, type }) => {
            if (type !== 'notify') return;

            const userReply = messages.find(msg => msg.key.quoted?.id === messageKey.id && msg.key.remoteJid === messageKey.remoteJid); 

            if (!userReply) return;

            client.ev.off('messages.upsert', handler);

            const replyText = userReply.message?.text || userReply.message?.conversation;

            if (!replyText || isNaN(replyText)) return m.reply("Invalid option. Please reply with 1 for audio or 2 for document.");

            const downloadChoice = parseInt(replyText);

            if (downloadChoice === 1) {
                try {
                    let data = await fetchJson(`https://api.dreaded.site/api/ytdl/audio?url=${url}`);
                    if (!data || !data.result || !data.result.download || !data.result.download.url) return m.reply("Failed to fetch audio from the API.");

                    const { metadata: { title, filename }, download: { url: audioUrl } } = data.result;

                    await m.reply(`_Downloading ${title}_`);

                    await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: "audio/mpeg", fileName: filename }, { quoted: m });
                } catch (error) {
                    m.reply("Audio Download failed\n" + error.message);
                }
            } else if (downloadChoice === 2) {
                await m.reply("Sending...");
                await client.sendMessage(
                    m.chat,
                    {
                        document: { url: audioUrl },
                        mimetype: "audio/mpeg",
                        fileName: filename,
                    },
                    { quoted: m }
                );
            } else {
                m.reply("Invalid choice. Please try again.");
            }
        };

        client.ev.on('messages.upsert', handler);

    } catch (error) {
        m.reply("An error occurred:\n" + error.message);
    }
};

