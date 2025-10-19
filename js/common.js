// Common functions used across all pages
document.addEventListener('DOMContentLoaded', function () {
    // Set current year in all footers
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // Close mobile menu when clicking outside
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    document.addEventListener('click', function (event) {
        if (menuToggle && menuToggle.checked) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = event.target.closest('.hamburger') || event.target === menuToggle;

            if (!isClickInsideMenu && !isClickOnToggle) {
                menuToggle.checked = false;
            }
        }
    });
});