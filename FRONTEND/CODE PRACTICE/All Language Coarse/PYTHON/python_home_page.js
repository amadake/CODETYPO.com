const header = document.getElementById('mainHeader');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('shrink');
        document.body.classList.add('scrolled');
    } else {
        header.classList.remove('shrink');
        document.body.classList.remove('scrolled');
    }
});