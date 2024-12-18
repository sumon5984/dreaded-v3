const yts = require("yt-search");
const { youtubeDownloader } = require('../../Functions/songDownloader'); 

module.exports = async (context) => {
  const { client, m, text } = context;

  if (!text) return m.reply("What song do you want to download?");

  try {
    // Search for the video based on the user's input (text)
    const { videos } = await yts(text);
    if (!videos || videos.length <= 0) {
      return m.reply(`No song found for: *${text}*!!`);
    }

    // Get the URL of the first video from the search results
    const urlYt = videos[0].url;
    console.log(`Found video URL: ${urlYt}`);

    // Fetch video details using the URL
    let data;
    try {
      data = await youtubeDownloader.detail(urlYt);
    } catch (error) {
      console.error("Error fetching video details:", error);
      return m.reply("Failed to fetch video details: " + error.message || error);
    }

    // Check if data is valid
    if (!data || !data.title || !data.access) {
      return m.reply("Failed to fetch valid video details.");
    }

    const { title, access } = data;
    await m.reply(`_Downloading ${title}_`);

    // Set audio quality (you can modify this to allow user input for quality)
    const quality = '128'; // Default audio quality (adjust as needed)

    // Fetch the media download URL for audio
    const mediaResult = await youtubeDownloader.media('audio', quality, access);

    if (mediaResult.status === false) {
      return m.reply("Download failed: " + mediaResult.message);
    }

    // Send the audio file to the user
    await client.sendMessage(m.chat, {
      document: { url: mediaResult.url },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (error) {
    console.error("Error in play.js:", error);  // Log the error for debugging
    m.reply("Download failed: " + error.message || error);
  }
};