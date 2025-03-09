const { DateTime } = require('luxon');
const fs = require('fs');

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname, prefix, pict } = context;

    try {
        const categories = [
            { name: 'AI', emoji: '🤖' },
            { name: 'General', emoji: '✍️' },
            { name: 'Media', emoji: '🎥' },
            { name: 'Search', emoji: '🔍' },
            { name: 'Settings', emoji: '⚙️' },
            { name: 'Editting', emoji: '✂️' },
            { name: 'Groups', emoji: '👥' },
            { name: 'Owner', emoji: '👑' },
            { name: 'Coding', emoji: '💻' },
            { name: 'Utils', emoji: '🎭' }
        ];

        const getGreeting = () => {
            const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;

            if (currentHour >= 5 && currentHour < 12) {
                return 'Good morning 🌄';
            } else if (currentHour >= 12 && currentHour < 18) {
                return 'Good afternoon ☀️';
            } else if (currentHour >= 18 && currentHour < 22) {
                return 'Good evening 🌆';
            } else {
                return 'Good night 😴';
            }
        };

        const getCurrentTimeInNairobi = () => {
            return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
        };

        let menuText = `Holla, ${getGreeting()},\n\n`;

        menuText += `👥 𝑼𝑺𝑬𝑹:- ${m.pushName}\n`;
        menuText += `👤 𝑩𝑶𝑻𝑵𝑨𝑴𝑬:- ${botname}\n`;
        menuText += `📝 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺:- ${totalCommands}\n`;
        menuText += '🕝 𝑻𝑰𝑴𝑬:- ' + getCurrentTimeInNairobi() + '\n';
        menuText += `✍️ 𝑷𝑹𝑬𝑭𝑰𝑿:- ${prefix}\n`;
        menuText += `🔓 𝑴𝑶𝑫𝑬:- ${mode}\n`;
        menuText += '💡 𝑳𝑰𝑩𝑹𝑨𝑹𝒀:- Baileys\n';

        menuText += '━━━━━━━\n';
        menuText += '━━━━━━\n';
        menuText += '━━━━━━━\n\n';

        const toBoldUppercaseFont = (text) => {
            const fonts = {
                'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
                'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        const toBoldLowercaseFont = (text) => {
            const fonts = {
                'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦',
                'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        for (const category of categories) {
            const commandFiles = fs.readdirSync(`./Cmds/${category.name}`).filter((file) => file.endsWith('.js'));

            const boldCategory = toBoldUppercaseFont(category.name.toUpperCase());

            menuText += `*${boldCategory} ${category.emoji}:* \n`;
            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                const boldCommandName = toBoldLowercaseFont(commandName);
                menuText += `  • ${boldCommandName}\n`;
            }

            menuText += '\n';
        }

        await client.sendMessage(m.chat, {
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: `DREADED V2`,
                    body: `Hi ${m.pushName}`,
                    thumbnail: pict,
                    sourceUrl: `https://github.com/Fortunatusmokaya/dreaded-v2`,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: m
        });

    } catch (error) {
        console.error(error);
        m.reply('An error occurred while fetching the menu.');
    }
};