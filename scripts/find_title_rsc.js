const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findSpecificTitle() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    let combined = parts.join('');

    // Specific title from HTML: "Portreli ve Çince/İngilizce kişiselleştirmeli geniş alıntı kartı"
    // It might be escaped differently. Let's try fragments.
    const searchStrs = [
        'Portreli ve',
        'kişiselleştirmeli',
        'alıntı kartı'
    ];

    searchStrs.forEach(s => {
        let idx = combined.indexOf(s);
        if (idx !== -1) {
            console.log(`Found "${s}" at ${idx}`);
            console.log(`Raw Context: ${combined.substring(idx - 100, idx + 500)}`);
        } else {
            // Try escaped version?
            const escaped = s.replace(/i/g, '\\\\u0069'); // Next.js often escapes chars
            console.log(`"${s}" not found.`);
        }
    });

    // Also search for "id":"151" which was in HTML
    const idStr = '"id":"151"';
    let idx = combined.indexOf(idStr);
    if (idx !== -1) {
        console.log(`Found "${idStr}" at ${idx}`);
    } else {
        console.log(`"${idStr}" not found.`);
        // Try escaped
        const escapedId = '\\"id\\":\\"151\\"';
        idx = combined.indexOf(escapedId);
        if (idx !== -1) {
            console.log(`Found escaped "${escapedId}" at ${idx}`);
            console.log(`Raw Context: ${combined.substring(idx - 100, idx + 500)}`);
        }
    }
}

findSpecificTitle();
