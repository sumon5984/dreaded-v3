const { DateTime } = require('luxon');
const fs = require('fs');

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname, prefix } = context;

    try {
        const categories = [
            { name: 'AI', emoji: '🤖' },
            { name: 'General', emoji: '✍️' },
            { name: 'Settings', emoji: '⚙️' },
            { name: 'Owner', emoji: '👑' },
            { name: 'Media', emoji: '🎥' },
            { name: 'Editting', emoji: '✂️' },
            { name: 'Groups', emoji: '👥' },
            { name: 'Random', emoji: '🪀' }
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

        // New visible font styles
        const toVisibleUppercaseFont = (text) => {
            const fonts = {
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠',
                'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        const toVisibleLowercaseFont = (text) => {
            const fonts = {
                'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺',
                'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        for (const category of categories) {
            const commandFiles = fs.readdirSync(`./Commands/${category.name}`).filter((file) => file.endsWith('.js'));

            const fancyCategory = toVisibleUppercaseFont(category.name.toUpperCase());

            menuText += `*${fancyCategory} ${category.emoji}:* \n`;
            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                const fancyCommandName = toVisibleLowercaseFont(commandName);
                menuText += `  • ${fancyCommandName}\n`;
            }

            menuText += '\n';
        }

        await client.sendMessage(m.chat, {
            video: { url: "https://telegra.ph/file/db49f1db0ec49d2ed289f.mp4" },
            caption: menuText,
            gifPlayback: true
        }, {
            quoted: m
        });

    } catch (error) {
        console.error(error);
        m.reply('An error occurred while fetching the menu.');
    }
};