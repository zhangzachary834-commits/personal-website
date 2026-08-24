// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            toggleMenu();
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                isMenuOpen = false;
                toggleMenu();
            });
        });
    }

    function toggleMenu() {
        // Toggle hamburger animation
        const spans = hamburger.querySelectorAll('span');
        if (isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            navLinks.style.display = 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(15, 15, 35, 0.98)';
            navLinks.style.flexDirection = 'column';
            navLinks.style.padding = '20px';
            navLinks.style.gap = '16px';
            navLinks.style.borderTop = '1px solid var(--border)';
            navLinks.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            navLinks.style.display = 'none';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.right = '';
            navLinks.style.background = '';
            navLinks.style.flexDirection = '';
            navLinks.style.padding = '';
            navLinks.style.gap = '';
            navLinks.style.borderTop = '';
            navLinks.style.boxShadow = '';
        }
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll animation to elements
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section-title, .project-card, .skill-card, .contact-link');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            } else {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    };

    // Set initial state for animated elements
    document.querySelectorAll('.section-title, .project-card, .skill-card, .contact-link').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Add active state to navbar based on scroll position
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });
    });

    // Add glow effect to active nav link
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active::after {
            width: 100%;
            background: var(--primary);
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });

    // Add typing effect to hero subtitle (optional)
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        };
        setTimeout(typeWriter, 800);
    }

    // Console message
    console.log('%c👋 Welcome to my website!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
    console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'font-size: 14px; color: #8b5cf6;');
});

// Handle keyboard navigation
window.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        toggleMenu();
    }
});
