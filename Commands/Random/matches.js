module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        let pl, laliga, bundesliga, serieA, ligue1;

        const plData = await fetchJson('https://api.dreaded.site/api/matches/PL');
        pl = plData.data;

        const laligaData = await fetchJson('https://api.dreaded.site/api/matches/PD');
        laliga = laligaData.data;

        const bundesligaData = await fetchJson('https://api.dreaded.site/api/matches/BL1');
        bundesliga = bundesligaData.data;

        const serieAData = await fetchJson('https://api.dreaded.site/api/matches/SA');
        serieA = serieAData.data;

        const ligue1Data = await fetchJson('https://api.dreaded.site/api/matches/FR');
        ligue1 = ligue1Data.data;

        let message = `Today Football Matches ⚽\n\n`;

        message += pl ? `🇬🇧 Premier League:\n${pl.map(match => {
            const { game, date, time } = match; // Extracting game, date, and time as separate properties
            return `${game}\nDate: ${date}\nTime: ${time}\n`;
        }).join('\n')}\n\n` : "🇬🇧 Premier League: No matches scheduled\n\n";

        if (laliga) {
            let laligaMatches = laliga.map(match => {
                const { game, date, time } = match;
                return `${game}\nDate: ${date}\nTime: ${time}\n`;
            }).join('\n');

            message += `🇪🇸 La Liga:\n${laligaMatches}\n\n`;
        } else {
            message += "🇪🇸 La Liga: No matches scheduled\n\n";
        }

        message += bundesliga ? `🇩🇪 Bundesliga:\n${bundesliga.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time}\n`;
        }).join('\n')}\n\n` : "🇩🇪 Bundesliga: No matches scheduled\n\n";

        message += serieA ? `🇮🇹 Serie A:\n${serieA.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time}\n`;
        }).join('\n')}\n\n` : "🇮🇹 Serie A: No matches scheduled\n\n";

        message += ligue1 ? `🇫🇷 Ligue 1:\n${ligue1.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time}\n`;
        }).join('\n')}\n\n` : "🇫🇷 Ligue 1: No matches scheduled\n\n";

        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch matches.');
    }
};