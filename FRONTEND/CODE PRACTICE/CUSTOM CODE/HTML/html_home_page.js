/**
 * CODETYPO Dashboard & File Uploader logic - JavaScript Version
 */

const initUploader = () => {
    // Scroll Elements
    const header = document.getElementById('mainHeader');
    const body = document.body;

    // File Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileDisplay = document.getElementById('fileDisplay');
    const fileNameDisplay = document.getElementById('fileName');
    const fileSizeDisplay = document.getElementById('fileSize');
    const removeBtn = document.getElementById('removeBtn');
    const startBtn = document.getElementById('startBtn');

    // 1. DYNAMIC HEADER SCROLL
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
            body.classList.add('scrolled');
        } else {
            header.classList.remove('shrink');
            body.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // 2. FILE SELECTION & VALIDATION
    dropZone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        // Updated validation for .js files
        if (file && file.name.endsWith('.js')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // Save code content for the next session
                const codeContent = event.target.result;
                localStorage.setItem('customJSCode', codeContent);
                localStorage.setItem('customJSFileName', file.name);

                // Update UI to show file selected
                fileNameDisplay.innerText = file.name;
                fileSizeDisplay.innerText = (file.size / 1024).toFixed(2) + " KB";
                dropZone.style.display = 'none';
                fileDisplay.style.display = 'flex';
                
                // Enable Start Button and add the 'ready' class for CSS glow
                startBtn.disabled = false;
                startBtn.classList.add('ready');
            };
            
            reader.readAsText(file);
        } else if (file) {
            alert("System Error: Only .js source files are accepted.");
            fileInput.value = "";
        }
    };

    // 3. INITIALIZE SESSION
    startBtn.addEventListener('click', () => {
        // Redirect to JS practice environment
        window.location.href = 'js_code_user.html';
    });

    // 4. REMOVE SELECTED FILE
    removeBtn.onclick = () => {
        fileInput.value = "";
        localStorage.removeItem('customJSCode');
        localStorage.removeItem('customJSFileName');
        
        dropZone.style.display = 'block';
        fileDisplay.style.display = 'none';
        startBtn.disabled = true;
        startBtn.classList.remove('ready');
    };

    // Drag and Drop visual feedback
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
    });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', initUploader);