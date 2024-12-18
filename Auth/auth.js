const fs = require('fs');
const { session } = require('./settings');

const sessionFilePath = "../Session/creds.json";

async function authenticationn() {
    try {
        if (!fs.existsSync(sessionFilePath)) {
            console.log("📡 connecting...");
            await fs.writeFileSync(sessionFilePath, atob(session), "utf8");
        } else if (fs.existsSync(sessionFilePath) && session !== "zokk") {
            await fs.writeFileSync(sessionFilePath, atob(session), "utf8");
        }
    } catch (e) {
        console.log("Session is invalid: " + e);
        return;
    }
}

module.exports = authenticationn;