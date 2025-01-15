const os = require('os');

module.exports = async (context) => {
    const { client, m, dreadedspeed } = context;

    const platform = os.platform();
    const arch = os.arch();
    const cpus = os.cpus();
    const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const hostname = os.hostname();

    const uptimes = (seconds) => {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor((seconds % (3600 * 24)) / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " Days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " Hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " Minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " Seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    };

    await m.reply(`🖥️ **SYSTEM STATUS**\n\n` +
        `⚡ **Speed**: ${dreadedspeed.toFixed(4)}ms\n\n` +
        `⏳ **Uptime**: ${uptimes(process.uptime())}\n\n` +
        `💻 **Platform**: ${platform}\n\n` +
        `🔧 **Architecture**: ${arch}\n\n` +
        `🖧 **CPU**: ${cpus.length} Core(s)\n\n` +
        `💾 **Total Memory**: ${totalMemory} GB\n\n` +
        `🆓 **Free Memory**: ${freeMemory} GB\n\n` +
        `🌐 **Hostname**: ${hostname}\n\n` +
        `🤖 **DREADED V3 BOT**`
    );
};