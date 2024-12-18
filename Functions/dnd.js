const { getGroupSettings, getSettings } = require('../Mongodb/Settingsdb');
const { getUser, createUser } = require('../Mongodb/Userdb'); 

module.exports = async (client, m) => {
const { default: Gemini } = await import('gemini-ai');

  const jid = m.sender;
    const chatId = m.chat;
    const userInput = m.text;
    const name = `dreaded digital assistant`;
const master = `Fortunatus Mokaya`;
    const botId = client.decodeJid(client.user.id);
    
      if (jid.includes(botId)) return;
      
        if (!chatId.endsWith("@s.whatsapp.net")) return;
        
          let settings = await getSettings();
          if (!settings.dnd) return;
          
          if (userInput) {
          const prompt = `You are a WhatsApp digital assistant. You will be responsible for handling this whatsapp account while ${master} is offline or unavailable. Your name will be ${name}. You will ask for their names if they have not told you yet so that in the messages you can refer to 
          the sender by their name. Then you will engage in lively conversations with them. You can ask questions to keep the conversation going. Respond directly to user queries without prefixes like "Assistant's response".`;
          
          let user = await getUser(jid);
    if (!user) {
      user = await createUser(jid);
    }
    
    user.messages.push({ sender: 'user', content: userInput });
    await user.save();
    
    const history = user.messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
    const instruction = `${prompt}\nChat history:\n${history}\nUser's input: ${userInput}`;
    
    const gemini = new Gemini('AIzaSyC3sNClbdraGrS2ubb5PTdnm_RbUANtdzc');
    const chat = gemini.createChat();
    let res = await chat.ask(instruction);
    
    res = res.replace(/^Assistant['’]?s? response:\s*/i, '');
    
    user.messages.push({ sender: 'assistant', content: res });
    await user.save();
    
    await m.reply(res);
    
    }

}
    