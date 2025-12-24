const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function inspectLine() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const lines = content.split('\n');
    const targetLine = lines[2337]; // Line 2338
    console.log(`Line 2338 length: ${targetLine.length}`);
    console.log(`Prefix: ${targetLine.substring(0, 1000)}`);
}

inspectLine();
