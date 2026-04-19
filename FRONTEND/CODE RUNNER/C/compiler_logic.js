const FileManager = {
    files: [{ name: 'main.c', content: '#include <stdio.h>\n\nint main() {\n    printf("Hello World");\n    return 0;\n}' }],
    activeIdx: 0,

    openNewFileModal() { document.getElementById('file-modal').style.display = 'block'; },
    closeModal() { document.getElementById('file-modal').style.display = 'none'; },

    createNewFile() {
        const nameInput = document.getElementById('new-file-name');
        const name = nameInput.value || `file${this.files.length + 1}.c`;
        this.files.push({ name: name, content: '// New C File\n' });
        nameInput.value = '';
        this.closeModal();
        this.renderTabs();
        this.switchTab(this.files.length - 1);
    },

    handleUpload(input) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.files.push({ name: file.name, content: e.target.result });
            this.renderTabs();
            this.switchTab(this.files.length - 1);
            this.closeModal();
        };
        reader.readAsText(file);
    },

    renderTabs() {
        const bar = document.getElementById('tab-bar');
        const tabsHTML = this.files.map((f, i) => `
            <div class="tab ${i === this.activeIdx ? 'active' : ''}" onclick="FileManager.switchTab(${i})">
                ${f.name}
            </div>
        `).join('');
        bar.innerHTML = tabsHTML + `<button class="add-tab-btn" onclick="FileManager.openNewFileModal()">+</button>`;
    },

    switchTab(idx) {
        // Save current content
        this.files[this.activeIdx].content = document.getElementById('code-editor').value;
        // Switch
        this.activeIdx = idx;
        document.getElementById('code-editor').value = this.files[idx].content;
        this.renderTabs();
    }
};

const Compiler = {
    run() {
        const output = document.getElementById('output-console');
        output.innerHTML = "Compiling " + FileManager.files[FileManager.activeIdx].name + "...<br>Running...<br>------------------<br>";
        
        // Simulating logic execution based on active editor
        const code = document.getElementById('code-editor').value;
        if(code.includes('printf')) {
            const match = code.match(/printf\("(.*)"\)/);
            output.innerHTML += match ? match[1] : "Execution error";
        }
        output.innerHTML += "<br>------------------<br>Process finished.";
    }
};

const Printer = {
    openModal() { document.getElementById('print-modal').style.display = 'block'; },
    closeModal() { document.getElementById('print-modal').style.display = 'none'; },
    executePrint() {
        let content = `<div style="padding:20px; font-family:monospace;"><h1>CODETYPO REPORT</h1>`;
        if(document.getElementById('print-code-check').checked) {
            content += `<h3>CODE:</h3><pre>${document.getElementById('code-editor').value}</pre>`;
        }
        if(document.getElementById('print-output-check').checked) {
            content += `<h3>OUTPUT:</h3><pre>${document.getElementById('output-console').innerText}</pre>`;
        }
        document.getElementById('printable-area').innerHTML = content;
        window.print();
        this.closeModal();
    }
};

// Handle closing modals by clicking outside
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
}