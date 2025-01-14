const axios = require("axios");
const { herokuAppName, herokuApiKey } = require("../../config");
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner } = context;

        if (!herokuAppName || !herokuApiKey) {
            await m.reply("It looks like the Heroku app name or API key is not set. Please make sure you have set the `HEROKU_APP_NAME` and `HEROKU_API_KEY` environment variables manually in Heroku.");
            return;
        }

        async function getLatestRepoCommit() {
            try {
                const response = await axios.get("https://api.github.com/repos/Fortunatusmokaya/dreaded-v3/commits/main");
                return response.data.sha;
            } catch (error) {
                console.error("Error fetching latest commit from GitHub:", error.message);
                return null;
            }
        }

        async function getHerokuDeployedCommit() {
            try {
                const response = await axios.get(
                    `https://api.heroku.com/apps/${herokuAppName}/builds`,
                    {
                        headers: {
                            Authorization: `Bearer ${herokuApiKey}`,
                            Accept: "application/vnd.heroku+json; version=3",
                        },
                    }
                );
                return response.data[0]?.commit;
            } catch (error) {
                console.error("Error fetching deployed commit from Heroku:", error.message);
                return null;
            }
        }

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

                await m.reply("Redeploy triggered successfully!");
                console.log("Build details:", response.data);
            } catch (error) {
                const errorMessage = error.response?.data || error.message;
                await m.reply(`Failed to update and redeploy. ${errorMessage} Please check if you have set the Heroku API key and Heroku app name correctly.`);
                console.error("Error triggering redeploy:", errorMessage);
            }
        }

        const latestRepoCommit = await getLatestRepoCommit();
        const deployedCommit = await getHerokuDeployedCommit();

        if (!latestRepoCommit || !deployedCommit) {
            await m.reply("Unable to fetch commit details. Please check the repository and Heroku app.");
            return;
        }

        if (latestRepoCommit === deployedCommit) {
            await m.reply("You are using the latest version of the bot.");
        } else {
            await m.reply("You are not using the latest version. A redeploy will be triggered.");
            redeployApp();
        }
    });
};