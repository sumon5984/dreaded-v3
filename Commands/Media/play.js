const { youtubeDownloader } = require('../../Functions/songDownloader'); 
const yts = require("yt-search");

module.exports = async (context) => {
  const { client, m, text } = context;

  if (!text) return m.reply("What song do you want to download?");


const fetch = require('node-fetch');

const types = ['video', 'audio'];
const qualityVideo = ['144', '240', '360', '480', '720'];
const qualityAudio = ['32', '64', '128', '192'];

const youtubeDownloader = {
  detail: async (url) => {
    try {
      const response = await fetch('https://cdn59.savetube.su/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch video details: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || !data.data) {
        throw new Error('Invalid response data');
      }

      const result = {
        title: data.data.title,
        url: data.data.url,
        duration: data.data.durationLabel,
        thumbnail: data.data.thumbnail_formats[0].url,
        id: data.data.id,
        access: data.data.key
      };

      return result;
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  },
  media: async (type, quality, key) => {
    try {
      const response = await fetch(`https://cdn51.savetube.su/download/${type}/${quality}/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        body: JSON.stringify({ key })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Media API Response:', data); // Log the full API response for debugging

      if (data && data.data && data.data.downloadUrl) {
        return {
          url: data.data.downloadUrl
        };
      } else {
        return {
          status: false,
          message: "Download URL not found."
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  },
  download: async (url, type, quality) => {
    try {
      const data = await youtubeDownloader.detail(url);

      const { access } = data;

      const mediaResult = await youtubeDownloader.media(type, quality, access);

      return {
        data,
        media: mediaResult
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
};

// Test the functions with a YouTube URL
const testUrl = 'https://youtu.be/AG-erEMhumc?si=X2GaD5RTSxjgL-qb'; // Replace with your YouTube URL
const type = 'audio'; // 'video' or 'audio'
const quality = '64'; // Try different qualities like '144', '360', '480', '720'

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

module.exports = youtubeDownloader;

  
};