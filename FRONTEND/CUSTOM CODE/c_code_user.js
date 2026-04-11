// Configuration & Data
const codeToType = localStorage.getItem('customPracticeCode') || "// No file found.\n// Please upload a .c file.";
const fileName = localStorage.getItem('customFileName') || "practice.c";

let currentIndex = 0;
let errors = 0;
let startTime = null;

// DOM Elements
const header = document.getElementById('mainHeader');
const codeDisplay = document.getElementById('code-display');
const hiddenInput = document.getElementById('hidden-input');
const startBtn = document.getElementById('init-session-btn');
const overlay = document.getElementById('start-overlay');
const timerEl = document.getElementById('timer');

// Initialize Layout
document.getElementById('tab-filename').innerText = fileName;

// 1. Header Shrink Logic
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('shrink');
        document.body.classList.add('scrolled');
    } else {
        header.classList.remove('shrink');
        document.body.classList.remove('scrolled');
    }
});

// 2. Initializing Practice
startBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    hiddenInput.focus();
    
    // Call external keyboard init if it exists
    if (typeof initKeyboard === "function") {
        initKeyboard('visual-keyboard'); 
    }
    
    renderCode();
});

function renderCode() {
    codeDisplay.innerHTML = '';
    [...codeToType].forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === '\n' ? '↵\n' : char;
        codeDisplay.appendChild(span);
    });
    updateUI();
}

// 3. Typing Engine
window.addEventListener('keydown', (e) => {
    // Prevent scrolling with Space or Tab
    if (e.key === ' ' || e.key === 'Tab') e.preventDefault();
    
    // Focus reinforcement
    hiddenInput.focus();

    const spans = document.querySelectorAll('.char');
    const typed = e.key === 'Enter' ? '\n' : e.key;

    // Start Timer on first keypress
    if (!startTime && e.key.length === 1) {
        startTime = new Date();
        startTimer();
    }

    if (e.key === 'Backspace' && currentIndex > 0) {
        currentIndex--;
        spans[currentIndex].className = 'char';
    } 
    else if (currentIndex < codeToType.length) {
        if (typed === codeToType[currentIndex]) {
            // Audio Hook
            if (typeof playClickSound === "function") playClickSound();

            spans[currentIndex].classList.add('correct');
            currentIndex++;

            // Smart Indentation Auto-skip
            while (codeToType[currentIndex] === ' ' && codeToType[currentIndex-1] === '\n') {
                spans[currentIndex].classList.add('correct');
                currentIndex++;
            }
        } 
        else if (e.key.length === 1 || e.key === 'Enter') {
            // Error Audio Hook
            if (typeof playErrorSound === "function") playErrorSound();

            spans[currentIndex].classList.add('incorrect');
            errors++;
        }
    }
    updateUI();
});

function updateUI() {
    const spans = document.querySelectorAll('.char');
    
    // Update text focus
    spans.forEach((s, i) => s.classList.toggle('current', i === currentIndex));
    
    if (spans[currentIndex]) {
        // Auto-scroll the editor
        spans[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Keyboard Hint Hook
        if (typeof highlightNextKey === "function") {
            const targetChar = codeToType[currentIndex];
            highlightNextKey(targetChar); 
        }
    } else if (currentIndex >= codeToType.length) {
        handleComplete();
    }
}

function startTimer() {
    let seconds = 300;
    const interval = setInterval(() => {
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        timerEl.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        
        // Simple WPM calculation
        const timeElapsed = (new Date() - startTime) / 60000;
        const wpm = Math.round((currentIndex / 5) / timeElapsed);
        document.getElementById('wpm-display').innerHTML = `${wpm} <small>wpm</small>`;

        if (seconds <= 0) clearInterval(interval);
    }, 1000);
}

function handleComplete() {
    alert("Code Practice Complete! Returning to Dashboard.");
    window.location.href = "lessons_list.html";
}