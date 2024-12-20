const handleCall = async (client, json, settingsss, handleCallAndBan) => {
  if (json.content[0].tag == 'offer') {
    const callCreator = json.content[0].attrs['call-creator'];
    const callId = json.content[0].attrs['call-id'];

    if (settingsss && settingsss.anticall) {
      if (settingsss.anticall === 'reject') {
        await client.rejectCall(callId, callCreator);
        await client.sendMessage(callCreator, { text: "We kindly request that you avoid calling as I am unable to handle calls at the moment." });
      } else if (settingsss.anticall === 'block') {
        await client.sendMessage(callCreator, { text: "We can't receive calls at the moment. You will be blocked and banned." });

await handleCallAndBan(json, client);
        await client.updateBlockStatus(callCreator, 'block');
        
      }
    }
  }
};

module.exports = handleCall;