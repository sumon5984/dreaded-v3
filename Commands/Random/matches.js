module.exports = async (context) => {

const moment = require('moment-timezone');
    const { client, m, text, fetchJson } = context;

    const leagues = [
        { code: 'PL', name: 'Premier League' },
        { code: 'PD', name: 'La Liga' },
        { code: 'BL1', name: 'Bundesliga' },
        { code: 'SA', name: 'Serie A' },
        { code: 'FR', name: 'Ligue 1' }
    ];

    try {
        let message = "Today Football Matches ⚽\n\n";

        
        const results = await Promise.all(leagues.map(async (league) => {
            const data = await fetchJson(`https://api.dreaded.site/api/matches/${league.code}`);
            const matches = data.data;

            if (matches === `No matches scheduled for ${league.code} today.`) {
                return `${league.name}: No matches scheduled`;
            } else {
                let leagueMatches = `${league.name}:\n`;
                matches.split('\n').forEach(match => {
                    const matchDate = match.match(/Date: (.*?)$/);
                    if (matchDate) {
                        const utcDate = matchDate[1];
                        const kenyaTime = moment(utcDate).tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss');
                        match = match.replace(utcDate, kenyaTime);
                    }
                    leagueMatches += `${match}\n`;
                });
                return leagueMatches;
            }
        }));

        
        message += results.join("\n\n");
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch matches.');
    }
};