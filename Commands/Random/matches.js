const moment = require('moment-timezone');

module.exports = async (context) => {
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

        for (let league of leagues) {
            const data = await fetchJson(`https://api.dreaded.site/api/matches/${league.code}`);
            const matches = data.data;

            if (matches.includes("No matches scheduled")) {
                message += `${league.name}: ${matches}\n\n`;
            } else {
                message += `${league.name}:\n`;

                matches.split('\n').forEach(match => {
                    const matchDate = match.match(/Date: (.*?)$/);

                    if (matchDate) {
                        const utcDate = matchDate[1];
                        const kenyaTime = moment(utcDate).tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss');
                        match = match.replace(utcDate, kenyaTime);
                    }

                    message += `${match}\n`;
                });

                message += "\n";
            }
        }

        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch matches.');
    }
};