const { getUser, createUser } = require('../../Mongodb/Userdb');

module.exports = async (context) => {
  const { client, m, text } = context;

  if (!text) return m.reply('Provide text to the AI. If my responses become redundant use gpt -reset to clear your conversation history.');
  const { default: Gemini } = await import('gemini-ai');

if (!process.env.GEMINI_API_KEY) return m.reply('I need a Gemini API key to handle this request. Please insert the key in the GEMINI_API_KEY environment variable.');

  const master = process.env.MASTER_NAME;
  const prompt = `You are a WhatsApp digital assistant called DREADED. Respond directly to user queries without prefixes like "Assistant's response".`;

  const jid = m.sender;
  const userInput = text;

  try {
    if (userInput.toLowerCase() === '-reset') {
      let user = await getUser(jid);
      if (user) {
        user.logs = [];
        await user.save();
        await m.reply('Your conversation history has been cleared and the context lost.');
      } else {
        await m.reply('No existing conversation history to reset.');
      }
      return;
    }

    let user = await getUser(jid);
    if (!user) {
      user = await createUser(jid);
    }

    user.logs.push({ author: 'client', details: userInput });
    await user.save();

    const history = user.logs.map(log => `${log.author}: ${log.details}`).join('\n');
    const instruction = `${prompt}\nChat history:\n${history}\nUser's input: ${userInput}`;

    const gemini = new Gemini(process.env.GEMINI_API_KEY);
    const chat = gemini.createChat();
    let res = await chat.ask(instruction);

    res = res.replace(/^Assistant['’]?s? response:\s*/i, '');

    user.logs.push({ author: 'system', details: res });
    await user.save();

    await m.reply(res);
  } catch (err) {
    console.error('Error handling Gemini command:', err);
    await m.reply('Sorry, an error occurred while processing your request.');
  }
};