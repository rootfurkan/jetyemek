const fs = require('fs');

const logPath = 'C:\\Users\\asus\\.gemini\\antigravity-ide\\brain\\7ff8d59f-b74b-4886-bb91-00d72695bfba\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'C:\\Users\\asus\\Desktop\\github projects\\jetyemek\\src\\panels\\customer\\pages\\Profile.jsx';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
let latestProfileContent = '';

for (const line of lines) {
  if (!line) continue;
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT' && data.content && data.content.includes('c:\\Users\\asus\\Desktop\\github projects\\jetyemek\\src\\panels\\customer\\pages\\Profile.jsx')) {
      const content = data.content;
      // Search for the diff
      const startTag = '[diff_block_start]';
      const endTag = '[diff_block_end]';
      const startIdx = content.indexOf(startTag);
      const endIdx = content.indexOf(endTag, startIdx);
      if (startIdx !== -1 && endIdx !== -1) {
        let diff = content.substring(startIdx + startTag.length, endIdx).trim();
        const lines = diff.split('\n');
        const extractedLines = [];
        for (const l of lines) {
          if (l.startsWith('@@')) continue;
          if (l.startsWith('+')) extractedLines.push(l.substring(1)); // remove +
          else if (l.startsWith(' ')) extractedLines.push(l.substring(1)); // remove space
        }
        latestProfileContent = extractedLines.join('\n');
      }
    }
  } catch (e) {
    // ignore parse errors
  }
}

if (latestProfileContent) {
  fs.writeFileSync(targetPath, latestProfileContent);
  console.log('Successfully recovered Profile.jsx (' + latestProfileContent.length + ' bytes)');
} else {
  console.log('Failed to find Profile.jsx content');
}
