const { getGroupSettings, getSettings } = require('../Mongodb/Settingsdb');
const { getUser, createUser } = require('../Mongodb/Userdb'); 

module.exports = async (client, m) => {
  const { default: Gemini } = await import('gemini-ai');

  const jid = m.sender;
  const chatId = m.chat;
  const userInput = m.text;
  const name = `dreaded digital assistant`;
  const master = process.env.MASTER_NAME;
  const botId = client.decodeJid(client.user.id);

  if (jid.includes(botId)) return;
  if (!chatId.endsWith("@s.whatsapp.net")) return;

  let settings = await getSettings();
  if (!settings.dnd) return;

  if (userInput) {
    if (userInput.toLowerCase().startsWith('-reset')) {
      let user = await getUser(jid);
      if (user) {
        user.messages = [];
        await user.save();
        await m.reply('Your conversation history has been cleared and the context lost.');
      } else {
        await m.reply('No existing conversation history to reset.');
      }
      return;
    }

    const prompt = `You are a WhatsApp digital assistant named ${name}. Your job is to manage this WhatsApp account on behalf of ${master}, who is currently unavailable. 
    If this is the first interaction or the user asks about ${master}, politely let them know that ${master} is unavailable and that you are here to assist. Do not repeatedly introduce yourself. You will only introduce yourself if it is the first message. Respond dynamically to user queries in a natural human and conversational manner. Ask relevant questions to keep the conversation engaging, and if appropriate, personalize your responses using the user's name if they have shared it.`;

    let user = await getUser(jid);
    if (!user) {
      user = await createUser(jid);
    }

    user.messages.push({ sender: 'user', content: userInput });
    await user.save();

    const history = user.messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
    const instruction = `${prompt}\nChat history:\n${history}\nUser's input: ${userInput}`;

    const gemini = new Gemini(process.env.GEMINI_API_KEY);
    const chat = gemini.createChat();
    let res = await chat.ask(instruction);

    res = res.replace(/^Assistant['’]?s? response:\s*/i, '');

    user.messages.push({ sender: 'assistant', content: res });
    await user.save();

    await m.reply(res);
  }
};