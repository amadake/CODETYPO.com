/**
 * CODETYPO Dashboard Interactions
 */

const initDashboard = () => {
    const header = document.getElementById('mainHeader');
    const body = document.body;

    // Handle scroll shrinking effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
            body.classList.add('scrolled');
        } else {
            header.classList.remove('shrink');
            body.classList.remove('scrolled');
        }
    };

    // Attach listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for scroll position on page load
    handleScroll();
};

// Run initialization
document.addEventListener('DOMContentLoaded', initDashboard);