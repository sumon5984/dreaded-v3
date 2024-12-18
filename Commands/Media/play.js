const yts = require("yt-search");
const { youtubeDownloader } = require('../../Functions/songDownloader'); 

module.exports = async (context) => {
  const { client, m, text } = context;

  if (!text) return m.reply("What song do you want to download?");

  try {
    // Search for the video based on the user's input (text)
    const { videos } = await yts(text);
    if (!videos || videos.length <= 0) {
      return m.reply(`No song found!`);
    }

    // Get the URL of the first video from the search results
    const urlYt = videos[0].url;
    const data = await youtubeDownloader.detail(urlYt);  // Fetch video details using the URL
    if (!data || !data.status) return m.reply("Failed to fetch video details.");

    const { title, access } = data;
    await m.reply(`_Downloading ${title}_`);

    // Choose the quality for the audio (you can also modify this to allow user input for quality)
    const quality = '128'; // Default audio quality, modify as necessary

    // Fetch the media download URL for audio
    const mediaResult = await youtubeDownloader.media('audio', quality, access);

    if (mediaResult.status === false) {
      return m.reply("Download failed: " + mediaResult.message);
    }

    // Send the audio file
    await client.sendMessage(m.chat, {
      document: { url: mediaResult.url },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (error) {
    m.reply("Download failed\n" + error);
  }
};