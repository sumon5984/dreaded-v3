const { getGroupSettings, getSettings } = require('../Mongodb/Settingsdb');
const { getUser, createUser } = require('../Mongodb/Userdb'); 
 

module.exports = async (client, m) => {
  const { default: Gemini } = await import('gemini-ai');

  const jid = m.sender;
  const chatId = m.chat;
  const userInput = m.text;
  const name = `dreaded digital assistant`;
  const master = process.env.MYNAME;
  const masterContact = process.env.OTHER_CONTACT; 
  const botId = client.decodeJid(client.user.id);

  if (jid.includes(botId)) return;
  if (!chatId.endsWith("@s.whatsapp.net")) return;

  let settings = await getSettings();
  if (!settings.dnd) return;

  let user = await getUser(jid);
  if (!user) {
    user = await createUser(jid);
  }

  if (userInput) {
    if (userInput.toLowerCase().startsWith('-reset')) {
      if (user.messages.length > 0) {
        user.messages = [];
        await user.save();
        await m.reply('Your conversation history has been cleared and the context lost.');
      } else {
        await m.reply('No existing conversation history to reset.');
      }
      return;
    }

    if (user.messages.length === 0) {
      await m.reply(
        `Thank you for reaching out to ${master}. At this time, ${master} is offline and unavailable to respond to your message. I am an AI, and I will be responding to chats. At any time, if I lose context or become redundant, please send -reset to clear your chat history and optimize myself.`
      );
    }

    const prompt = `You are a WhatsApp digital assistant named ${name}. Engage in dynamic, friendly conversations, answering queries naturally and without unnecessary repetition. Ask relevant questions to keep the interaction lively and personalize your responses using the user's name if they have shared it. Be concise, polite, and focused on providing useful and meaningful interactions. You will say you are acting on behalf of ${master} only when asked.`;

    user.messages.push({ sender: 'user', content: userInput });
    await user.save();

    const history = user.messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
    const instruction = `${prompt}\nChat history:\n${history}\nUser's input: ${userInput}`;

    try {
      const gemini = new Gemini(process.env.GEMINI_API_KEY);
      const chat = gemini.createChat();
      let res = await chat.ask(instruction);

      res = res.replace(/^Assistant['’]?s? response:\s*/i, '');

      user.messages.push({ sender: 'assistant', content: res });
      await user.save();

      await m.reply(res);
    } catch (error) {
      if (!user.geminiErrorNotified) {




        await m.reply(
          `Unfortunately, ${master} is currently offline and unavailable.  You can reach them directly through ${masterContact}.  Do not send another message as it will be ignored till they come back. Thank you for your patience.`
        );
        user.geminiErrorNotified = true;
        await user.save();
      }
    }
  }
};