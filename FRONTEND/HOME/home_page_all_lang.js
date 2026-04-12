
const handleScroll = () => {
    const header = document.getElementById('mainHeader');
    const body = document.body;

    if (window.scrollY > 50) {
        header.classList.add('shrink');
        body.classList.add('scrolled');
    } else {
        header.classList.remove('shrink');
        body.classList.remove('scrolled');
    }
};

// Initialize scroll listener
window.addEventListener('scroll', handleScroll);

// Optional: Run once on load to check initial scroll position
document.addEventListener('DOMContentLoaded', handleScroll);