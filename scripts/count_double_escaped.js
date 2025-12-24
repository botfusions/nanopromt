const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function countDoubleEscaped() {
    const content = fs.readFileSync(sourcePath, 'utf8');

    const doubleEscapedTitle = (content.match(/\\\\\\"title\\\\\\":/g) || []).length;
    const doubleEscapedPrompt = (content.match(/\\\\\\"prompt\\\\\\":/g) || []).length;

    console.log(`\\\\\\"title\\\\\\": ${doubleEscapedTitle}`);
    console.log(`\\\\\\"prompt\\\\\\": ${doubleEscapedPrompt}`);
}

countDoubleEscaped();
