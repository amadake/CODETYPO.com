// --- 1. CONFIGURATION & DATA ---
const jsCode = localStorage.getItem('customJSCode') || "console.log('No JS file found.');\nfunction hello() {\n  return 'Please upload a .js file';\n}";
const fileName = localStorage.getItem('customJSFileName') || "script.js";

let currentIndex = 0;
let timerId = null;
let timeLeft = 300;
let startTime = null;
let inactivityTimer = null;

// Audio Engine for Clicks/Errors
const AudioEngine = {
    ctx: null,
    init() { if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    play(freq, type, duration) {
        this.init();
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(0.1, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + duration);
    }
};

// Keyboard Visualization Engine
const KeyboardEngine = {
    rows: [
        ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BACK"],
        ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
        ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "ENTER"],
        ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "SHIFT"],
        ["SPACE"]
    ],
    init() {
        const kb = document.getElementById('visual-keyboard');
        this.rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'kb-row';
            row.forEach(key => {
                const k = document.createElement('div');
                k.className = 'key';
                k.textContent = key;
                k.dataset.key = key;
                if(["BACK","TAB","CAPS","ENTER","SHIFT"].includes(key)) k.classList.add('wide');
                if(key === "SPACE") k.classList.add('space');
                rowDiv.appendChild(k);
            });
            kb.appendChild(rowDiv);
        });
    },
    highlight(char) {
        document.querySelectorAll('.key').forEach(k => k.classList.remove('active-target'));
        if(!char) return;
        let target = char.toUpperCase();
        if(char === '\n') target = "ENTER";
        if(char === ' ') target = "SPACE";
        
        const el = document.querySelector(`.key[data-key="${target}"]`);
        if(el) el.classList.add('active-target');
    },
    pressEffect(key) {
        let target = key.toUpperCase();
        if(key === ' ') target = "SPACE";
        if(key === 'Enter') target = "ENTER";
        const el = document.querySelector(`.key[data-key="${target}"]`);
        if(el) {
            el.classList.add('pressed');
            setTimeout(() => el.classList.remove('pressed'), 100);
        }
    }
};

// --- 2. CORE ENGINE ---

function startGame() {
    document.getElementById('start-overlay').style.display = 'none';
    document.getElementById('tab-name').innerText = fileName;
    KeyboardEngine.init();
    renderCode();
    updateState();
}

function renderCode() {
    const display = document.getElementById('code-display');
    [...jsCode].forEach(c => {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = (c === '\n') ? '↵\n' : c;
        display.appendChild(s);
    });
}

function updateState() {
    const spans = document.querySelectorAll('.char');
    
    if(currentIndex >= jsCode.length) {
        clearInterval(timerId);
        alert("Practice session finished!");
        window.location.href = 'html_home_page.html';
        return;
    }

    spans.forEach((s, i) => s.classList.toggle('current', i === currentIndex));
    
    if (spans[currentIndex]) {
        spans[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        KeyboardEngine.highlight(jsCode[currentIndex]);
    }
}

window.addEventListener('keydown', (e) => {
    if(document.getElementById('start-overlay').style.display !== 'none') return;
    
    // UI Feedback
    KeyboardEngine.pressEffect(e.key);
    document.getElementById('pause-indicator').style.display = 'none';
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => { document.getElementById('pause-indicator').style.display = 'flex'; }, 5000);

    if(e.key === 'Tab' || e.key === ' ') e.preventDefault();

    // Timer & WPM Logic
    if(!startTime) {
        startTime = new Date();
        timerId = setInterval(() => {
            timeLeft--;
            const m = Math.floor(timeLeft/60), s = timeLeft%60;
            document.getElementById('timer').textContent = `${m}:${s<10?'0':''}${s}`;
            
            // Calculate WPM
            const elapsedMins = (new Date() - startTime) / 60000;
            const wpm = Math.round((currentIndex / 5) / elapsedMins) || 0;
            document.getElementById('wpm-val').textContent = wpm;

            if(timeLeft <= 0) clearInterval(timerId);
        }, 1000);
    }

    const typed = (e.key === 'Enter') ? '\n' : e.key;
    const spans = document.querySelectorAll('.char');

    if(e.key === 'Backspace' && currentIndex > 0) {
        currentIndex--;
        spans[currentIndex].className = 'char';
    } else if(currentIndex < jsCode.length) {
        if(typed === jsCode[currentIndex]) {
            AudioEngine.play(600, 'sine', 0.05); // Play click
            spans[currentIndex].classList.add('correct');
            currentIndex++;
            
            // Auto-skip indentation spaces (Very common in JS code)
            while(jsCode[currentIndex] === ' ' && jsCode[currentIndex-1] === '\n') {
                spans[currentIndex].classList.add('correct');
                currentIndex++;
            }
        } else if(e.key.length === 1 || e.key === 'Enter') {
            AudioEngine.play(150, 'square', 0.1); // Play error
            spans[currentIndex].classList.add('incorrect');
        }
    }
    updateState();
});