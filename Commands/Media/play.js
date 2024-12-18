const { youtubeDownloader } = require('../../Functions/songDownloader'); 
const yts = require("yt-search");

module.exports = async (context) => {
  const { client, m, text } = context;

  if (!text) return m.reply("What song do you want to download?");


const testUrl = 'https://youtu.be/vtNJMAyeP0s?si=9iJeJKed5pzO4ib1'; // Replace with your YouTube URL
const type = 'audio'; // 'video' or 'audio'
const quality = '360'; // Set the quality you want, e.g., '144', '360', '720'

async function testDownload() {
  try {
    const result = await youtubeDownloader.download(testUrl, type, quality);
    if (result.status === false) {
      console.log('Error:', result.message);
    } else {
      console.log('Download data:', result);
    }
  } catch (error) {
    console.log('Test failed:', error.message);
  }
}

testDownload();


  
};