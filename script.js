// script.js - Basic Interactivity
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Toggle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Smooth scrolling for anchor links if needed
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Set dynamic copyright year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // FAQ Toggle Function
    window.showDesc = function(c) {
        var desctab = "Desc" + c;
        var carrot = "carrot" + c;
        var title = "title" + c;

        if (document.getElementById(desctab).style.display == "inline-block") {
            document.getElementById(desctab).style.display = "none";
            document.getElementById(carrot).style.backgroundPosition = "100% 100%";
            document.getElementById(title).style.color = "black";
        } else {
            document.getElementById(desctab).style.display = "inline-block";
            document.getElementById(carrot).style.backgroundPosition = "0% 0%";
            document.getElementById(title).style.color = "#e11e26";
        }
    }
});