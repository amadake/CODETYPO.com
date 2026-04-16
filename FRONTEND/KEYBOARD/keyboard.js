// keyboard.js
const Keyboard = {
    layouts: {
        US: [
            ["~ `", "! 1", "@ 2", "# 3", "$ 4", "% 5", "^ 6", "& 7", "* 8", "( 9", ") 0", "_ -", "+ =", "back"],
            ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{ [", "} ]", "| \\"],
            ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ": ;", "\" '", "enter"],
            ["shift", "Z", "X", "C", "V", "B", "N", "M", "< ,", "> .", "? /", "shift"],
            ["space"]
        ]
    },

    init(containerId) {
        const kb = document.getElementById(containerId);
        if (!kb) return;
        
        kb.innerHTML = '';
        const keyboardWrapper = document.createElement('div');
        keyboardWrapper.className = 'keyboard';

        this.layouts.US.forEach(row => {
            const rDiv = document.createElement('div');
            rDiv.className = 'kb-row';
            row.forEach(keyStr => {
                const k = document.createElement('div');
                k.className = 'key';
                const parts = keyStr.split(' ');

                if (parts.length > 1 && keyStr !== 'space') {
                    k.innerHTML = `<span class="top-char">${parts[0]}</span><span class="bot-char">${parts[1]}</span>`;
                    k.dataset.char = parts[1].toUpperCase();
                    k.dataset.shift = parts[0];
                } else {
                    const main = parts[0].toUpperCase();
                    k.textContent = main;
                    k.dataset.char = main;
                    if (['BACK', 'TAB', 'CAPS', 'ENTER', 'SHIFT'].includes(main)) k.classList.add('wide');
                    if (keyStr === 'space') { 
                        k.classList.add('space'); 
                        k.dataset.char = 'SPACE'; 
                        k.textContent = ''; 
                    }
                }
                rDiv.appendChild(k);
            });
            keyboardWrapper.appendChild(rDiv);
        });
        kb.appendChild(keyboardWrapper);
    },

    highlight(targetChar) {
        // Remove existing highlights
        document.querySelectorAll('.key').forEach(k => k.classList.remove('active'));

        if (!targetChar) return;

        // Add highlight to the specific key
        document.querySelectorAll('.key').forEach(k => {
            const isMatch = k.dataset.char === targetChar.toUpperCase() || 
                            k.dataset.shift === targetChar || 
                            (targetChar === ' ' && k.dataset.char === 'SPACE') || 
                            (targetChar === '\n' && k.dataset.char === 'ENTER');
            if (isMatch) k.classList.add('active');
        });
    }
};