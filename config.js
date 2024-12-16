const session = process.env.SESSION || '';
const mongoURI = process.env.MONGO_URI || '';
const mycode = process.env.CODE || '254';
const botname = process.env.BOTNAME || 'DREADED';

module.exports = {
  session,
  mongoURI,
  mycode,
  botname
}; 