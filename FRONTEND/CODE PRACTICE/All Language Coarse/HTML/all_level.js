// game-engine.js
const GameEngine = {
    code: "",
    resultPage: "",
    currentIndex: 0,
    timeLeft: 180,
    timerId: null,
    totalErrors: 0,
    inactivityTimer: null,
    isPaused: false,
    startTime: null,

    init(config) {
        this.code = config.code;
        this.resultPage = config.resultPage;
        
        // Build the UI
        Keyboard.init('visual-keyboard');
        this.setupText();
        this.setupEventListeners();
    },

    setupText() {
        const display = document.getElementById('code-display');
        display.innerHTML = '';
        [...this.code].forEach(c => {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = c === '\n' ? '↵\n' : c;
            display.appendChild(s);
        });
        this.updateUI();
    },

    updateUI() {
        const spans = document.querySelectorAll('.char');
        if (this.currentIndex >= this.code.length) {
            return this.finishLevel(false);
        }

        spans.forEach((s, i) => s.classList.toggle('current', i === this.currentIndex));
        spans[this.currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Call Keyboard Tool
        Keyboard.highlight(this.code[this.currentIndex]);
    },

    startTimer() {
        if (this.timerId) return;
        this.timerId = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                let m = Math.floor(this.timeLeft / 60), s = this.timeLeft % 60;
                document.getElementById('timer').textContent = `0${m}:${s < 10 ? '0' : ''}${s}`;
                if (this.timeLeft <= 0) this.finishLevel(true);
            }
        }, 1000);
    },

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (document.getElementById('start-overlay').style.display !== 'none') return;

            this.isPaused = false;
            document.getElementById('pause-indicator').style.display = 'none';
            clearTimeout(this.inactivityTimer);
            this.startTimer();

            if (e.key === ' ' || e.key === 'Tab') e.preventDefault();

            this.inactivityTimer = setTimeout(() => {
                if (this.currentIndex < this.code.length) {
                    this.isPaused = true;
                    document.getElementById('pause-indicator').style.display = 'flex';
                }
            }, 5000);

            const typed = e.key === 'Enter' ? '\n' : e.key;
            const spans = document.querySelectorAll('.char');

            if (e.key === 'Backspace') {
                if (spans[this.currentIndex]?.classList.contains('incorrect')) {
                    spans[this.currentIndex].classList.remove('incorrect');
                } else if (this.currentIndex > 0) {
                    this.currentIndex--;
                    spans[this.currentIndex].className = 'char';
                }
            } else if (this.currentIndex < this.code.length) {
                if (typed === this.code[this.currentIndex]) {
                    SoundEngine.playClick();
                    spans[this.currentIndex].classList.add('correct');
                    this.currentIndex++;
                } else if (e.key.length === 1 || e.key === 'Enter') {
                    if (!spans[this.currentIndex].classList.contains('incorrect')) {
                        this.totalErrors++;
                        SoundEngine.playError();
                        spans[this.currentIndex].classList.add('incorrect');
                    }
                }
            }
            this.updateUI();
        });
    },

    finishLevel(failed) {
        clearInterval(this.timerId);
        const totalSec = 180 - this.timeLeft;
        const wpm = Math.round((this.currentIndex / 5) / (totalSec / 60)) || 0;
        const acc = Math.round(((this.currentIndex - this.totalErrors) / this.currentIndex) * 100) || 0;
        window.location.href = `${this.resultPage}?chars=${this.currentIndex}&errors=${this.totalErrors}&sec=${totalSec}&wpm=${wpm}&acc=${acc}&failed=${failed}`;
    }
};

// Global helper for the Start button
function startGame() {
    document.getElementById('start-overlay').style.display = 'none';
    document.getElementById('hidden-input').focus();
    // Logic starts via GameEngine.init called in the HTML
}

function toggleModal(id, show) {
    document.getElementById(id).style.display = show ? 'flex' : 'none';
}