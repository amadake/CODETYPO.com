const JavaEditor = {
    files: [{ 
        name: "Main.java", 
        content: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeTypo!");\n    }\n}` 
    }],
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

        document.getElementById('new-filename-input').onkeyup = (e) => {
            if (e.key === 'Enter') this.confirmAddTab();
        };
    },

    addTab() {
        const modal = document.getElementById('filename-modal');
        const input = document.getElementById('new-filename-input');
        input.value = "Class" + (this.files.length + 1) + ".java";
        modal.style.display = "flex";
        input.focus();
        input.select();
    },

    closeModal() {
        document.getElementById('filename-modal').style.display = "none";
    },

    confirmAddTab() {
        const input = document.getElementById('new-filename-input');
        let name = input.value.trim();
        if(!name.endsWith('.java')) name += '.java';
        
        if (name) {
            this.files.push({ name: name, content: `public class ${name.replace('.java', '')} {\n\n}` });
            this.activeIdx = this.files.length - 1;
            this.renderTabs();
            this.loadActiveFile();
            this.closeModal();
        }
    },

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

    run() {
        const consoleOut = document.getElementById('console-output');
        consoleOut.innerHTML = `<span style="color: #64748b;">> Compiling ${this.files[this.activeIdx].name}...</span><br>`;
        
        // In a real app, you would use fetch() to send 'code' to a Java Backend
        // This is a simulation:
        setTimeout(() => {
            const code = document.getElementById('code-editor').value;
            if (code.includes("System.out.println")) {
                const match = code.match(/System\.out\.println\("(.*)"\)/);
                const output = match ? match[1] : "Execution finished.";
                consoleOut.innerHTML += `<span style="color: #10b981;">[SUCCESS]</span><br>${output}`;
            } else {
                consoleOut.innerHTML += `<span style="color: #f43f5e;">[ERROR]</span> No output detected.`;
            }
        }, 800);
    },

    toggleFS() {
        const panel = document.getElementById('preview-panel');
        const iconContainer = document.getElementById('fs-icon-container');
        this.isFullscreen = !this.isFullscreen;
        panel.classList.toggle('fullscreen-mode', this.isFullscreen);
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

    printPDF() {
        const content = document.getElementById('console-output').innerText;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<pre style="font-family: monospace;">${content}</pre>`);
        printWindow.print();
    },

    startPractice() {
        window.location.href = '/FRONTEND/CODE PRACTICE/All Language Coarse/Java/java_practice_home.html';
    }
};


document.addEventListener('DOMContentLoaded', () => JavaEditor.init());