const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, botname, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("Provide a TikTok link for the video.");
        if (!text.includes("tiktok.com")) return m.reply("That is not a valid TikTok link.");

        const data = await fetchJson(`https://api.dreaded.site/api/tiktok?url=${text}`);

        if (!data || data.status !== 200 || !data.tiktok || !data.tiktok.video) {
            return m.reply(`API Error: ${data?.message || "Invalid API response"}`);
        }

        const tikVideoUrl = data.tiktok.video;
        const tikDescription = data.tiktok.description;
        const tikAuthor = data.tiktok.author.nickname || "Unknown Author";
        const tikLikes = data.tiktok.statistics.likeCount || "0";
        const tikComments = data.tiktok.statistics.commentCount || "0";
        const tikShares = data.tiktok.statistics.shareCount || "0";

        const caption = `🎥 TikTok Video\n\n📌 *Description:* ${tikDescription}\n👤 *Author:* ${tikAuthor}\n❤️ *Likes:* ${tikLikes}\n💬 *Comments:* ${tikComments}\n🔗 *Shares:* ${tikShares}`;

        await client.sendMessage(m.chat, {
            video: { url: tikVideoUrl },
            mimetype: "video/mp4",
            caption: caption
        }, { quoted: m });

    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};