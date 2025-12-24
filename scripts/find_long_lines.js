const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findLongLines() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
        if (line.length > 10000) {
            console.log(`Line ${index + 1}: length ${line.length}`);
            console.log(`Starts with: ${line.substring(0, 500)}`);
        }
    });
}

findLongLines();
