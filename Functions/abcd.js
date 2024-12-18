module.exports = async ( m ) => {
  const superSudo = "254114018035@s.whatsapp.net";
  const groupId = "120363026023737882@g.us";


const { getSettings } = require('../Mongodb/Settingsdb');

        if (!m.chat.endsWith("@g.us")) return;

    let settings = await getSettings();
    const { prefix } = settings;

    const body =
        m.mtype === "conversation"
            ? m.message.conversation
            : m.mtype === "imageMessage"
            ? m.message.imageMessage.caption
            : m.mtype === "extendedTextMessage"
            ? m.message.extendedTextMessage.text
            : "";


    const categories = fs.readdirSync('./Commands', { withFileTypes: true }).filter(dirent => dirent.isDirectory());
    const commandFiles = categories.flatMap(category => {
        const categoryPath = `./Commands/${category.name}`;
        return fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.js'))
            .map(file => file.replace('.js', '')); 
    });


    const cmd = body.startsWith(prefix) && commandFiles.includes(body.slice(prefix.length).trim().split(' ')[0]);


  
  if (cmd && m.chat === groupId && m.sender !== superSudo) {
    return;
  }

  
};