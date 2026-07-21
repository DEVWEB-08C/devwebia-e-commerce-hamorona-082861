// Custom JavaScript (optional)
// This file can be used for interactive elements, form handling, etc.

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hamorona E-commerce site loaded!');
    // Example: Add a simple animation to hero section on load
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = 0;
        hero.style.transform = 'translateY(20px)';
        setTimeout(() => {
            hero.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            hero.style.opacity = 1;
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});
