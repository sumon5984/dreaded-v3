/* const similarity = require('similarity');
const path = require('path');
const fs = require('fs');

const cmdsDir = path.join(__dirname, '..', 'Commands');

function findAllCommandFiles(dir) {
    let commandFiles = [];
    let totalCommands = 0;

    function findFiles(directory) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                findFiles(filePath);
            } else if (file.endsWith('.js')) {
                commandFiles.push(filePath);
                totalCommands++;
            }
        }
    }

    findFiles(dir);
    return { commandFiles, totalCommands };
}

const { commandFiles } = findAllCommandFiles(cmdsDir);

const getCommands = () => {
    return commandFiles.map(file => path.basename(file, '.js'));
};

const findClosestCommand = (inputCommand, threshold = 0.6) => {
    const availableCommands = getCommands();
    let closestCommand = '';
    let maxSimilarity = 0;

    availableCommands.forEach(command => {
        const similarityScore = similarity(inputCommand.toLowerCase(), command.toLowerCase());

        if (similarityScore > maxSimilarity && similarityScore < 1) {
            maxSimilarity = similarityScore;
            closestCommand = command;
        }
    });

    if (maxSimilarity >= threshold) {
        return closestCommand;
    }

    return null;
};

module.exports = { findClosestCommand };

*/