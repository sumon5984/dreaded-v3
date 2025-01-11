module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) return m.reply("No songs found!");

        const urlYt = videos[0].url;
        let data = await fetchJson(`https://api.dreaded.site/api/ytdl/audio?url=${urlYt}`);

        if (!data || !data.result || !data.result.download || !data.result.download.url) {
            return m.reply("Failed to fetch audio from the API.");
        }

        const {
            metadata: { title, thumbnail, duration, author },
            download: { url: audioUrl, quality, filename },
        } = data.result;

        const downloadPrompt = await m.reply(`
            Song found: ${title} by ${author}

            Choose download format:
            1. Audio
            2. Document (coming soon)

            Reply with 1 or 2 to proceed.
        `);

        const promptStanzaId = downloadPrompt.key.id;

        const handleReply = async (message) => {
            if (message.quotedMessage?.stanzaId === promptStanzaId && message.key.remoteJid === m.chat && message.key.participant === m.sender && message.message?.conversation) {
                const replyText = message.message.conversation.trim();
                if (replyText === "1") {
                    await m.reply(`_Downloading ${title}_`);
                    await client.sendMessage(
                        m.chat,
                        {
                            audio: { url: audioUrl },
                            mimetype: "audio/mpeg",
                            fileName: filename,
                        },
                        { quoted: m }
                    );
                } else if (replyText === "2") {
                    await m.reply("Document download is not implemented yet, but coming soon!");
                }
                client.ev.off('messages.upsert', handleReply);
            }
        };

        client.ev.on('messages.upsert', handleReply);

        setTimeout(() => {
            client.ev.off('messages.upsert', handleReply);
        }, 30000);

    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};
