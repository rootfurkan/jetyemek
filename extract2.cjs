const fs = require('fs');

const logPath = 'C:\\Users\\asus\\.gemini\\antigravity-ide\\brain\\7ff8d59f-b74b-4886-bb91-00d72695bfba\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'C:\\Users\\asus\\Desktop\\github projects\\jetyemek\\src\\panels\\customer\\pages\\Profile.jsx';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
let bestContent = '';

for (const line of lines) {
  if (!line) continue;
  try {
    const data = JSON.parse(line);
    // Convert entire object to string to search easily
    const dataStr = JSON.stringify(data);
    if (dataStr.includes('export default function Profile() {') && dataStr.includes('currentPage')) {
      // Find the diff block start
      const startTag = '[diff_block_start]';
      const endTag = '[diff_block_end]';
      const startIdx = dataStr.indexOf(startTag);
      const endIdx = dataStr.indexOf(endTag, startIdx);
      if (startIdx !== -1 && endIdx !== -1) {
        let diff = dataStr.substring(startIdx + startTag.length, endIdx).trim();
        // Unescape JSON string
        diff = diff.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        const diffLines = diff.split('\n');
        const extractedLines = [];
        for (const l of diffLines) {
          if (l.startsWith('@@')) continue;
          if (l.startsWith('+')) extractedLines.push(l.substring(1)); // remove +
          else if (l.startsWith(' ')) extractedLines.push(l.substring(1)); // remove space
        }
        bestContent = extractedLines.join('\n');
      } else if (data.content && data.content.includes('export default function Profile')) {
          // Maybe it's just raw content?
          // We will fallback to writing the whole content if diff block is not found.
      }
    }
  } catch (e) {
  }
}

if (bestContent) {
  fs.writeFileSync(targetPath, bestContent);
  console.log('Successfully recovered Profile.jsx (' + bestContent.length + ' bytes)');
} else {
  console.log('Failed to find Profile.jsx content');
}
