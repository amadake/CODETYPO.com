// compiler_logic.js
const Compiler = {
    outputBox: null,
    editor: null,
    isWaitingForInput: false,
    inputQueue: [],
    currentLine: 0,
    variables: {},

    init(editorId, outputId) {
        this.editor = document.getElementById(editorId);
        this.outputBox = document.getElementById(outputId);
    },

    // GCC-style Error Simulation
    checkSyntax(code) {
        const lines = code.split('\n');
        let openBraces = 0;

        if (!code.includes("#include <stdio.h>")) {
            return `main.c:1:1: warning: implicit declaration of header 'stdio.h'`;
        }

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === "" || line.startsWith("#") || line.startsWith("//") || line.endsWith("{") || line.endsWith("}")) continue;
            
            // Check missing semicolon
            if (line.length > 0 && !line.endsWith(";") && !line.includes("int main") && !line.includes("if")) {
                return `main.c:${i + 1}:${line.length}: error: expected ';' before end of line`;
            }
        }

        // Bracket matching
        const opens = (code.match(/{/g) || []).length;
        const closes = (code.match(/}/g) || []).length;
        if (opens !== closes) {
            return `main.c: error: mismatched braces { ... }`;
        }

        return null; // No errors
    },

    run() {
        const code = this.editor.value;
        this.outputBox.innerHTML = "Compiling main.c...<br>Running program...<br>--------------------<br>";
        this.variables = {};
        
        const error = this.checkSyntax(code);
        if (error) {
            this.outputBox.innerHTML += `<span style="color: #f43f5e;">${error}</span>`;
            return;
        }

        this.executeCode(code);
    },

    async executeCode(code) {
        const lines = code.split('\n');
        for (let line of lines) {
            line = line.trim();

            // Handle printf
            if (line.startsWith("printf")) {
                const match = line.match(/"([^"]+)"/);
                if (match) {
                    let text = match[1].replace(/\\n/g, '<br>');
                    this.print(text);
                }
            }

            // Handle scanf (The Input System)
            if (line.startsWith("scanf")) {
                this.print('<span style="color: #38bdf8;">▋ </span>'); // Input cursor
                const userInput = await this.waitForInput();
                this.print(`<span style="color: #fbbf24;">${userInput}</span><br>`);
            }
        }
        this.print("<br>--------------------<br>Process finished with exit code 0");
    },

    print(text) {
        this.outputBox.innerHTML += text;
        this.outputBox.scrollTop = this.outputBox.scrollHeight;
    },

    waitForInput() {
        this.isWaitingForInput = true;
        return new Promise((resolve) => {
            const handleKey = (e) => {
                if (e.key === "Enter") {
                    window.removeEventListener("keydown", handleKey);
                    let val = this.tempInputBuffer || "0";
                    this.tempInputBuffer = "";
                    this.isWaitingForInput = false;
                    resolve(val);
                } else if (e.key.length === 1) {
                    this.tempInputBuffer = (this.tempInputBuffer || "") + e.key;
                    this.outputBox.innerHTML += e.key; // Show typing in terminal
                }
            };
            window.addEventListener("keydown", handleKey);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Compiler.init('code-editor', 'output-console');
    document.getElementById('run-button').onclick = () => Compiler.run();

    // Tab key support
    document.getElementById('code-editor').addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            this.value = this.value.substring(0, start) + "    " + this.value.substring(this.selectionEnd);
            this.selectionStart = this.selectionEnd = start + 4;
        }
    });
});

