const { getUser, createUser } = require('../../Mongodb/Userdb');
const { default: Gemini } = await import('gemini-ai');

module.exports = async (context) => {
  const { client, m, text } = context;

  const master = 'mokaya';
  const prompt = `You are a WhatsApp digital assistant. Respond directly to user queries without prefixes like "Assistant's response".`;

  const jid = m.chat;
  const userInput = text;

  try {
    // Retrieve or create user
    let user = await getUser(jid);
    if (!user) {
      user = await createUser(jid);
    }

    // Add user's message to history
    user.messages.push({ sender: 'user', content: userInput });
    await user.save();

    // Create conversation history for context
    const history = user.messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
    const instruction = `${prompt}\nChat history:\n${history}\nUser's input: ${userInput}`;

    // Gemini API integration
    const gemini = new Gemini('AIzaSyC3sNClbdraGrS2ubb5PTdnm_RbUANtdzc');
    const chat = gemini.createChat();
    let res = await chat.ask(instruction);

    // Clean the response (remove "Assistant's response:" or similar prefixes)
    res = res.replace(/^Assistant['’]?s? response:\s*/i, '');

    // Save assistant's response
    user.messages.push({ sender: 'assistant', content: res });
    await user.save();

    // Send the cleaned response to the user
    await m.reply(res);
  } catch (err) {
    console.error('Error handling Gemini command:', err);
    await m.reply('Sorry, an error occurred while processing your request.');
  }
};