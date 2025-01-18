module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("Provide some text or query, This AI will search and summarise results from Google.");
    }

const data = await fetchJson(`https://api.dreaded.site/api/aisearch?query=${text}`);

if (data && data.data && data.data.result) {

const res = data.data.result;

await m.reply(res)

} else {

m.reply("Invalid response from API")

}

}

