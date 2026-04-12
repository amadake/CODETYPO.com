const HTMLEditor = {
    files: [{ name: "index.html", content: "<h1>Page 1 Content</h1>" }],
    activeIdx: 0,
    isFullscreen: false,

    init() {
        this.renderTabs();
        this.loadActiveFile();

        document.getElementById('code-editor').onkeydown = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.target.selectionStart;
                e.target.value = e.target.value.substring(0, s) + "    " + e.target.value.substring(e.target.selectionEnd);
                e.target.selectionStart = e.target.selectionEnd = s + 4;
            }
        };

        // Allow pressing "Enter" in the modal input
        document.getElementById('new-filename-input').onkeyup = (e) => {
            if (e.key === 'Enter') this.confirmAddTab();
        };
    },

    // --- NEW MODAL FUNCTIONS ---
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
            this.activeIdx = this.files.length - 1;
            this.renderTabs();
            this.loadActiveFile();
            this.closeModal();
        }
    },
    // --- END MODAL FUNCTIONS ---

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
        this.run();
    },

    run() {
        const code = document.getElementById('code-editor').value;
        const frame = document.getElementById('live-preview');
        const doc = frame.contentWindow.document;

        const hideScrollCSS = `
            <style>
                html, body { scrollbar-width: none; -ms-overflow-style: none; }
                body::-webkit-scrollbar { display: none; }
            </style>
        `;

        doc.open();
        doc.write(hideScrollCSS + code);
        doc.close();
    },

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
    }
};

document.addEventListener('DOMContentLoaded', () => HTMLEditor.init());