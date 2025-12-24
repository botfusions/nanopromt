const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function countPrompts() {
    const content = fs.readFileSync(sourcePath, 'utf8');

    const escapedCount = (content.match(/\\"prompt\\":/g) || []).length;
    const htmlEscapedCount = (content.match(/&quot;prompt&quot;:/g) || []).length;
    const rawCount = (content.match(/"prompt":/g) || []).length;

    console.log(`\\"prompt\\": ${escapedCount}`);
    console.log(`&quot;prompt&quot;: ${htmlEscapedCount}`);
    console.log(`"prompt": ${rawCount}`);

    // Let's also check for "content" or "body"
    const contentCount = (content.match(/\\"content\\":/g) || []).length;
    console.log(`\\"content\\": ${contentCount}`);
}

countPrompts();
