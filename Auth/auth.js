const fs = require('fs');
const { session } = require('../config');

async function authenticationn() {
    try {
        if (!fs.existsSync("../Session/creds.json")) {
            console.log("📡 connecting...");
            await fs.writeFileSync("../Session/creds.json", atob(session), "utf8");
        }
        else if (fs.existsSync("../Session/creds.json") && session != "zokk") {
            await fs.writeFileSync("../Session/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session is invalid: " + e);
        return;
    }
}

module.exports = authenticationn; 