const HTMLEditor = {
    files: [{ name: "index.html", content: "<h1>Page 1 Content</h1>" }],
    activeIdx: 0,
    isFullscreen: false,

    init() {
        this.renderTabs();
        this.loadActiveFile();

        // Keyboard Shortcut: Handle Tab key in editor
        document.getElementById('code-editor').onkeydown = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.target.selectionStart;
                e.target.value = e.target.value.substring(0, s) + "    " + e.target.value.substring(e.target.selectionEnd);
                e.target.selectionStart = e.target.selectionEnd = s + 4;
            }
        };

        // Modal Shortcut: Press Enter to create file
        document.getElementById('new-filename-input').onkeyup = (e) => {
            if (e.key === 'Enter') this.confirmAddTab();
        };

        // PDF Modal Shortcut: Press Enter to print
        document.getElementById('pdf-username-input').onkeyup = (e) => {
            if (e.key === 'Enter') this.confirmPrint();
        };
    },

    // --- TAB & FILE MANAGEMENT ---
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
        // Save current code to the active file before switching
        this.files[this.activeIdx].content = document.getElementById('code-editor').value;
        this.activeIdx = i;
        this.renderTabs();
        this.loadActiveFile();
    },

    loadActiveFile() {
        document.getElementById('code-editor').value = this.files[this.activeIdx].content;
        this.run();
    },

    // --- CREATE NEW FILE MODAL ---
    addTab() {
        const modal = document.getElementById('filename-modal');
        const input = document.getElementById('new-filename-input');
        input.value = "page" + (this.files.length + 1) + ".html";
        modal.style.display = "flex";
        input.focus();
        input.select();
    },

    closeModal() {
        document.getElementById('filename-modal').style.display = "none";
    },

    confirmAddTab() {
        const input = document.getElementById('new-filename-input');
        const name = input.value.trim();
        
        if (name) {
            this.files.push({ name: name, content: "<h1>New Page: " + name + "</h1>" });
            this.activeIdx = this.files.length - 1; // Go to the new tab immediately
            this.renderTabs();
            this.loadActiveFile();
            this.closeModal();
        }
    },

    // --- UPLOAD FILE FROM SYSTEM ---
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const fileName = file.name;

            // Add new file to our array
            this.files.push({ name: fileName, content: content });
            this.activeIdx = this.files.length - 1; // Switch to the uploaded file
            
            this.renderTabs();
            this.loadActiveFile();
            this.closeModal();
            
            // Clear input so same file can be uploaded again if needed
            event.target.value = '';
        };
        reader.readAsText(file);
    },

    // --- PREVIEW LOGIC ---
    run() {
        const code = document.getElementById('code-editor').value;
        const frame = document.getElementById('live-preview');
        const doc = frame.contentWindow.document;

        // Injected CSS to hide scrollbars in the preview but allow scrolling
        const hideScrollCSS = `
            <style>
                html, body { 
                    scrollbar-width: none; 
                    -ms-overflow-style: none; 
                    overflow-y: auto; 
                }
                body::-webkit-scrollbar { display: none; }
            </style>
        `;

        doc.open();
        doc.write(hideScrollCSS + code);
        doc.close();
    },

    // --- PDF PRINTING (CUSTOM MODAL) ---
    printPDF() {
        document.getElementById('print-modal').style.display = 'flex';
        document.getElementById('pdf-username-input').focus();
    },

    closePrintModal() {
        document.getElementById('print-modal').style.display = 'none';
        document.getElementById('pdf-username-input').value = '';
    },

    confirmPrint() {
        let userName = document.getElementById('pdf-username-input').value.trim();
        if (userName === "") userName = "Student Developer";

        const previewFrame = document.getElementById('live-preview');
        const renderedOutput = previewFrame.contentWindow.document.documentElement.innerHTML;
        const sourceCode = document.getElementById('code-editor').value;
        
        // Escape code so it prints as text
        const escapedCode = sourceCode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const printWindow = window.open('', '_blank', 'width=900,height=1000');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Project Report - ${userName}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Fira+Code&family=Montserrat:wght@700&display=swap');
                        body { font-family: sans-serif; padding: 40px; color: #0f172a; }
                        .pdf-header { text-align: center; margin-bottom: 40px; border-bottom: 4px solid #10b981; padding-bottom: 20px; }
                        .user-badge { display: inline-block; margin-top: 10px; background: #f1f5f9; padding: 5px 15px; border-radius: 50px; font-family: 'Montserrat'; font-weight: 700; color: #6366f1; border: 1px solid #e2e8f0; }
                        .section-label { font-family: 'Montserrat'; text-transform: uppercase; font-size: 11px; font-weight: 800; color: #94a3b8; margin: 30px 0 10px 0; }
                        .output-container { border: 2px solid #f1f5f9; padding: 20px; border-radius: 12px; }
                        .code-container { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 12px; font-family: 'Fira Code', monospace; font-size: 12px; white-space: pre-wrap; }
                        @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    </style>
                </head>
                <body>
                    <div class="pdf-header">
                        <h1 style="font-family:Montserrat; margin:0;">CODETYPO Report</h1>
                        <div class="user-badge">Developer: ${userName}</div>
                    </div>
                    <div class="section-label">Rendered Result</div>
                    <div class="output-container">${renderedOutput}</div>
                    <div class="section-label">Source Code</div>
                    <pre class="code-container">${escapedCode}</pre>
                    <script>
                        window.onload = function() {
                            setTimeout(() => { window.print(); window.close(); }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
        this.closePrintModal();
    },

    // --- UI NAVIGATION ---
    toggleFS() {
        const panel = document.getElementById('preview-panel');
        const iconContainer = document.getElementById('fs-icon-container');
        this.isFullscreen = !this.isFullscreen;

        if (this.isFullscreen) {
            panel.classList.add('fullscreen-mode');
            iconContainer.innerHTML = `<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;
        } else {
            panel.classList.remove('fullscreen-mode');
            iconContainer.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
        }
    },

    startPractice() {
        window.location.href = '/FRONTEND/CODE PRACTICE/All Language Coarse/HTML/html_practice_home_Beginner.html';
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => HTMLEditor.init());