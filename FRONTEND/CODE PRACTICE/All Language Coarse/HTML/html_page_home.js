document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('mainHeader');
    const body = document.body;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
            body.classList.add('scrolled');
        } else {
            header.classList.remove('shrink');
            body.classList.remove('scrolled');
        }
    });
});