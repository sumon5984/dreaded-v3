const axios = require('axios');

module.exports = async (context) => {
    const { client, mime, m, text, botname } = context;

    if (m.quoted && text) {
        const buffer = await m.quoted.download();
        

        if (!/image|pdf/.test(mime)) return m.reply("That's neither an image nor a PDF, quote a PDF document or an image with instructions.");

        const query = text;
        const base64String = buffer.toString('base64');

        await m.reply(`A moment, dreaded is analyzing the contents of the ${mime.includes("pdf") ? "PDF document" : "image"} you provided...`);

        try {
            const response = await axios.post('https://api.dreaded.site/api/gemini-analyze', {
                query: query,
                imageBuffer: base64String
            }, {
                headers: {
                    'Content-Type': 'application/json'  
                }
            });

            console.log(response.data);
            await m.reply(response.data.result);
        } catch (error) {
            const errorMessage = error.message || 'An unknown error occurred.';
            const maxErrorLength = 200;
            const replyMessage = errorMessage.length > maxErrorLength
                ? errorMessage.substring(0, maxErrorLength) + '...'
                : errorMessage;

            console.error("Error in sending request:", error);
            await m.reply(replyMessage);
        }
    } else {
        m.reply("Quote a PDF or image with instructions for bot to analyse.");
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