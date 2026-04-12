/**
 * CODETYPO Dashboard & File Uploader logic
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
        if (file && file.name.endsWith('.c')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // Save code content for the next session
                const codeContent = event.target.result;
                localStorage.setItem('customPracticeCode', codeContent);
                localStorage.setItem('customFileName', file.name);

                // Update UI to show file selected
                fileNameDisplay.innerText = file.name;
                fileSizeDisplay.innerText = (file.size / 1024).toFixed(2) + " KB";
                dropZone.style.display = 'none';
                fileDisplay.style.display = 'flex';
                
                // Enable Start Button
                startBtn.disabled = false;
            };
            
            reader.readAsText(file);
        } else if (file) {
            alert("System Error: Only .c source files are accepted.");
            fileInput.value = "";
        }
    };

    // 3. INITIALIZE SESSION
    startBtn.addEventListener('click', () => {
        // Redirect to practice environment
        window.location.href = 'c_code_user_code.html';
    });

    // 4. REMOVE SELECTED FILE
    removeBtn.onclick = () => {
        fileInput.value = "";
        localStorage.removeItem('customPracticeCode');
        localStorage.removeItem('customFileName');
        
        dropZone.style.display = 'block';
        fileDisplay.style.display = 'none';
        startBtn.disabled = true;
    };
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', initUploader);