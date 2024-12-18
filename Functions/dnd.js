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
    const prompt = `You are a WhatsApp digital assistant named ${name}. Your role is to manage this WhatsApp account while ${master} is unavailable. 
    If it's the first time the user is messaging or they ask about ${master}, you should politely inform them that ${master} is currently unavailable, and you are here to assist. 
    Avoid repeating introductions in every message. If the user has not shared their name, politely ask for it once and refer to them by it in subsequent responses. 
    Engage in dynamic, friendly conversations, asking relevant questions to keep the interaction lively. Respond concisely and directly to their queries without using phrases like "Assistant's response".`;

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