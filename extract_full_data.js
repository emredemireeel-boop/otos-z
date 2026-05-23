const fs = require('fs');

const transcriptPath = 'C:\\\\Users\\\\GAMER\\\\.gemini\\\\antigravity-ide\\\\brain\\\\87b599fc-ba68-4bde-ace1-2d59136796ce\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);

let allReplacedText = '';

for (const line of lines) {
    try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
            for (const call of obj.tool_calls) {
                // Determine format
                let name = null;
                let args = null;

                if (call.name && call.args) {
                    name = call.name;
                    args = typeof call.args === 'string' ? JSON.parse(call.args) : call.args;
                } else if (call.function && call.function.arguments) {
                    name = call.function.name;
                    args = typeof call.function.arguments === 'string' ? JSON.parse(call.function.arguments) : call.function.arguments;
                }

                if (name === 'default_api:multi_replace_file_content' || name === 'default_api:replace_file_content' || name === 'default_api:write_to_file') {
                    if (args.ReplacementChunks) {
                        for (const chunk of args.ReplacementChunks) {
                            allReplacedText += '\n' + chunk.ReplacementContent;
                        }
                    }
                    if (args.ReplacementContent) {
                        allReplacedText += '\n' + args.ReplacementContent;
                    }
                    if (args.CodeContent) {
                        allReplacedText += '\n' + args.CodeContent;
                    }
                }
            }
        }
    } catch(e) {}
}

fs.writeFileSync('all_tool_calls_text.txt', allReplacedText);
console.log('Done extracting tool calls text to all_tool_calls_text.txt');
