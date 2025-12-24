const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function inspectTLine() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    let combined = parts.join('');
    // Unescape once
    combined = combined
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n');

    const tIdx = combined.indexOf(':T');
    if (tIdx !== -1) {
        console.log(`Found :T at ${tIdx}`);
        const lineStart = combined.lastIndexOf('\n', tIdx) + 1;
        const lineEnd = combined.indexOf('\n', tIdx);
        const line = combined.substring(lineStart, lineEnd === -1 ? combined.length : lineEnd);
        console.log(`Line length: ${line.length}`);
        console.log('Start of line:', line.substring(0, 1000));
        console.log('End of line:', line.substring(line.length - 1000));

        // Save this huge line to a separate file for easier inspection if needed
        fs.writeFileSync(path.join(__dirname, '../rsc_t_line.txt'), line);
    } else {
        console.log(':T not found in combined unescaped string.');
        // Maybe it's not unescaped yet?
    }
}

inspectTLine();
