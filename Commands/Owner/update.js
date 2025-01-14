const axios = require("axios");
const { herokuAppName, herokuApiKey } = require("../../config");
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner } = context;

        async function redeployApp() {
            try {
                const response = await axios.post(
                    `https://api.heroku.com/apps/${herokuAppName}/builds`,
                    {
                        source_blob: {
                            url: "https://github.com/Fortunatusmokaya/dreaded-v3/tarball/main",
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${herokuApiKey}`,
                            Accept: "application/vnd.heroku+json; version=3",
                        },
                    }
                );

                await m.reply("An update and redeploy has been triggered successfully. Wait 2mins for bot to start.");
                console.log("Build details:", response.data);
            } catch (error) {
                const errorMessage = error.response?.data || error.message;
                await m.reply(`Failed to update and redeploy. ${errorMessage} Please check if you have set the Heroku API key and Heroku app name correctly. Also note that this command will work if you are deploying directly from main repo. For forks you have to do a manual redeploy and sync.`);
                console.error("Error triggering redeploy:", errorMessage);
            }
        }

        redeployApp();
    });
};