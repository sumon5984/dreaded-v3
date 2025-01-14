module.exports = {
    aliases: ["speed"], 
    execute: async (context) => {
        const { m, dreadedspeed } = context;
        await m.reply(`Pong\n${dreadedspeed.toFixed(4)}ms`);
    },
};