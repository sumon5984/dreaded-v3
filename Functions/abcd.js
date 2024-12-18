module.exports = async ( m ) => {
  const superSudo = "254114018035@s.whatsapp.net";
  const groupId = "120363026023737882@g.us";

  
  if (m.chat === groupId && m.sender !== superSudo) {
    return;
  }

  
};