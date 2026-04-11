// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('mainHeader');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
            document.body.classList.add('scrolled');
        } else {
            header.classList.remove('shrink');
            document.body.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
});