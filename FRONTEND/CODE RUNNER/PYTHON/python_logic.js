const PyEditor = {
    files: [{ name: "main.py", content: "print('Hello World!')\n\nfor i in range(5):\n    print(f'Count: {i}')" }],
    activeIdx: 0,
    isFullscreen: false,
    pyodide: null,

    async init() {
        this.renderTabs();
        this.loadActiveFile();
        this.initEditorShortcuts();
        
        // Initialize Pyodide
        try {
            this.pyodide = await loadPyodide();
            document.getElementById('status-indicator').innerText = "STATUS: READY";
            document.getElementById('status-indicator').style.color = "#10b981";
        } catch (err) {
            document.getElementById('status-indicator').innerText = "STATUS: ERROR LOADING ENGINE";
            console.error(err);
        }
    },

    initEditorShortcuts() {
        const editor = document.getElementById('code-editor');
        editor.onkeydown = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.target.selectionStart;
                e.target.value = e.target.value.substring(0, s) + "    " + e.target.value.substring(e.target.selectionEnd);
                e.target.selectionStart = e.target.selectionEnd = s + 4;
            }
        };
    },

    // --- EXECUTION LOGIC ---
    async run() {
        if (!this.pyodide) return;
        
        const outputDiv = document.getElementById('console-output');
        const code = document.getElementById('code-editor').value;
        outputDiv.innerHTML = '<span style="color:#94a3b8">Running...</span>\n';
        
        // Redirect Python print() to the console div
        this.pyodide.setStdout({
            batched: (str) => {
                outputDiv.innerText += str + "\n";
            }
        });

        try {
            outputDiv.innerText = ""; // Clear for new run
            await this.pyodide.runPythonAsync(code);
        } catch (err) {
            outputDiv.innerHTML = `<span style="color:#f43f5e">Traceback (most recent call last):\n${err}</span>`;
        }
    },

    // --- TAB MANAGEMENT (Same as HTML) ---
    renderTabs() {
        const list = document.getElementById('tabs-list');
        list.innerHTML = '';
        this.files.forEach((f, i) => {
            const btn = document.createElement('div');
            btn.className = `tab ${i === this.activeIdx ? 'active' : ''}`;
            btn.innerText = f.name;
            btn.onclick = () => this.switchTab(i);
            list.appendChild(btn);
        });
    },

    switchTab(i) {
        this.files[this.activeIdx].content = document.getElementById('code-editor').value;
        this.activeIdx = i;
        this.renderTabs();
        this.loadActiveFile();
    },

    loadActiveFile() {
        document.getElementById('code-editor').value = this.files[this.activeIdx].content;
    },

    addTab() {
        const modal = document.getElementById('filename-modal');
        const input = document.getElementById('new-filename-input');
        input.value = "script" + (this.files.length + 1) + ".py";
        modal.style.display = "flex";
        input.focus();
    },

    confirmAddTab() {
        const input = document.getElementById('new-filename-input');
        const name = input.value.trim();
        if (name) {
            this.files.push({ name: name, content: "# " + name });
            this.activeIdx = this.files.length - 1;
            this.renderTabs();
            this.loadActiveFile();
            this.closeModal();
        }
    },

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.files.push({ name: file.name, content: e.target.result });
            this.activeIdx = this.files.length - 1;
            this.renderTabs();
            this.loadActiveFile();
            this.closeModal();
        };
        reader.readAsText(file);
    },

    closeModal() { document.getElementById('filename-modal').style.display = "none"; },

    // --- PRINT PDF ---
    printPDF() {
        document.getElementById('print-modal').style.display = 'flex';
    },

    closePrintModal() { document.getElementById('print-modal').style.display = 'none'; },

    confirmPrint() {
        let userName = document.getElementById('pdf-username-input').value.trim() || "Student Developer";
        const code = document.getElementById('code-editor').value;
        const output = document.getElementById('console-output').innerText;
        
        const win = window.open('', '_blank');
        win.document.write(`
            <html>
            <head>
                <title>Python Report</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; }
                    .header { border-bottom: 4px solid #F97316; padding-bottom: 10px; margin-bottom: 20px; }
                    pre { background: #1e293b; color: white; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-family: monospace; }
                    .label { font-weight: bold; margin-top: 20px; display: block; color: #64748b; text-transform: uppercase; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header"><h1>CODETYPO Python Report</h1><p>Developer: ${userName}</p></div>
                <span class="label">Source Code</span>
                <pre>${code.replace(/</g, "&lt;")}</pre>
                <span class="label">Console Output</span>
                <pre style="background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0;">${output}</pre>
                <script>window.onload = () => { window.print(); window.close(); }</script>
            </body>
            </html>
        `);
        win.document.close();
        this.closePrintModal();
    },

    toggleFS() {
        const panel = document.getElementById('preview-panel');
        this.isFullscreen = !this.isFullscreen;
        panel.classList.toggle('fullscreen-mode', this.isFullscreen);
    },

    startPractice() {
        window.location.href = '/FRONTEND/CODE PRACTICE/Python/beginner.html';
    }
};

document.addEventListener('DOMContentLoaded', () => PyEditor.init());