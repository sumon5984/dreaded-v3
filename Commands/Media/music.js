module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        m.reply("Starting download process...");
        if (!text) return m.reply("What song do you want to download?");
        m.reply("Searching for the song...");
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) return m.reply("No songs found!");
        m.reply("Song found!");
        const chosenVideo = videos[0];
        const { title, thumbnail, duration, author, url } = chosenVideo;
        m.reply(`Title: ${title}, URL: ${url}`);
        const downloadOptionsMessage = {
            caption: `*${title}*\n\nBy: ${author}\nDuration: ${duration}\nDownload Link: ${url}\n\nChoose download format:\n1. Audio\n2. Document`,
            image: { url: thumbnail },
        };
        m.reply("Sending download options...");
        const sentMessage = await client.sendMessage(m.chat, downloadOptionsMessage, { quoted: m });
        const messageKey = sentMessage.key;
        m.reply(`Sent message key: ${JSON.stringify(messageKey)}`);

        let hasReplied = false;

        const handler = async ({ messages, type }) => {
            if (hasReplied) return;

            m.reply(`messages.upsert event triggered: Type: ${type}, Messages: ${JSON.stringify(messages)}`);

            if (type !== 'notify') {
                m.reply("Ignoring non-notify message.");
                return;
            }

            const userReply = messages.find(msg => msg.key.quoted?.id === messageKey.id && msg.message?.extendedTextMessage?.contextInfo?.stanzaId === messageKey.id);

            m.reply(`User Reply: ${JSON.stringify(userReply)}`);

            if (!userReply) {
                m.reply("No user reply found matching the prompt.");
                return;
            }

            hasReplied = true;
            client.ev.off('messages.upsert', handler);

            const replyText = userReply.message?.text || userReply.message?.conversation;
            m.reply(`Reply Text: ${replyText}`);

            if (!replyText || isNaN(replyText)) return m.reply("Invalid option. Please reply with 1 for audio or 2 for document.");

            const downloadChoice = parseInt(replyText);
            m.reply(`Download Choice: ${downloadChoice}`);

            if (downloadChoice === 1) {
                try {
                    m.reply("Starting audio download...");
                    let data = await fetchJson(`https://api.dreaded.site/api/ytdl/audio?url=${url}`);
                    if (!data || !data.result || !data.result.download || !data.result.download.url) return m.reply("Failed to fetch audio from the API.");
                    const { metadata: { title, filename }, download: { url: audioUrl } } = data.result;
                    await m.reply(`_Downloading ${title}_`);
                    await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: "audio/mpeg", fileName: filename }, { quoted: m });
                } catch (error) {
                    m.reply(`Audio Download failed\n${error.message}`);
                }
            } else if (downloadChoice === 2) {
                m.reply("Sending");
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
        m.reply(`An error occurred:\n${error.message}`);
    }
};
