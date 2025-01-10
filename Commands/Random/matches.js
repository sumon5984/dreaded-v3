const moment = require('moment-timezone');

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        let pl, laliga, bundesliga, serieA, ligue1;
        
        const plData = await fetchJson('https://api.dreaded.site/api/matches/PL');
        pl = formatMatches('Premier League', plData.data);

        const laligaData = await fetchJson('https://api.dreaded.site/api/matches/PD');
        laliga = formatMatches('La Liga', laligaData.data);

        const bundesligaData = await fetchJson('https://api.dreaded.site/api/matches/BL1');
        bundesliga = formatMatches('Bundesliga', bundesligaData.data);

        const serieAData = await fetchJson('https://api.dreaded.site/api/matches/SA');
        serieA = formatMatches('Serie A', serieAData.data);

        const ligue1Data = await fetchJson('https://api.dreaded.site/api/matches/FR');
        ligue1 = formatMatches('Ligue 1', ligue1Data.data);

        let message = `Today Football Matches ⚽\n\n`;

        message += pl ? `${pl}\n` : "Premier League: No matches scheduled\n";
        message += laliga ? `${laliga}\n` : "La Liga: No matches scheduled\n";
        message += bundesliga ? `${bundesliga}\n` : "Bundesliga: No matches scheduled\n";
        message += serieA ? `${serieA}\n` : "Serie A: No matches scheduled\n";
        message += ligue1 ? `${ligue1}\n` : "Ligue 1: No matches scheduled\n";

        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch matches.' + error);
    }
};

function formatMatches(leagueName, matchesData) {
    if (matchesData === `No matches scheduled for ${leagueName} today.`) {
        return `${leagueName}: No matches scheduled`;
    }

    let formattedMatches = `${leagueName}:\n`;
    matchesData.split('\n').forEach(match => {
        const matchDate = match.match(/Date: (.*?)$/);
        if (matchDate) {
            const utcDate = matchDate[1];
            const kenyaTime = moment(utcDate).tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss');
            match = match.replace(utcDate, kenyaTime);
        }
        formattedMatches += `${match}\n`;
    });
    return formattedMatches;
}