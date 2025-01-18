module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;
const axios = require('axios');

if (!m.quoted) return m.reply("quote an image or pdf for analysis");

if (!text) return m.reply("Provide some instruction");

    const query = text

   
    const Buffer = await m.quoted.download();

    
    const base64 = Buffer.toString('base64');

   
    try {
        const response = await axios.get('https://api.dreaded.site/api/gemini-analyze', {
            params: {
                query: query,
                imageBuffer: base64
            }
        });

        console.log(response.data);
await m.reply(response.data.result);

    } catch (error) {
        console.error("Error in sending request:", error);
    }
}







/* module.exports = async (context) => {
    const { client, m, text, mime, uploadtoimgur, fetchJson } = context;

        
const axios = require("axios");

try {

if (!m.quoted) return m.reply("Send the image then tag it with the instruction.");

if (!text) return m.reply("Provide some instruction. This vision AI is powered by gemini-pro-vision.");



   if (!/image/.test(mime)) return m.reply("That is not an image, try again while quoting an actual image.");             

let fdr = await client.downloadAndSaveMediaMessage(m.quoted)


                    let fta = await uploadtoimgur(fdr)
                    m.reply("A moment, dreaded is analyzing contents of the image. . .");


const data = await fetchJson(`https://api.dreaded.site/api/gemini-vision?url=${fta}&instruction=${text}`);

let res = data.result

await m.reply(res);

  

} catch (e) {

m.reply("I am unable to analyze images at the moment\n" + e)

}
}

*/