// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Create additional floating elements dynamically
document.addEventListener('DOMContentLoaded', function () {
    const floatingContainer = document.querySelector('.floating-elements');
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-element');
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;

        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.top = `${posY}%`;
        element.style.left = `${posX}%`;
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;

        floatingContainer.appendChild(element);
    }
});

//first section js part

document.addEventListener('DOMContentLoaded', function () {
    // Intersection Observer for scroll animations
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.image-wrapper, .content-wrapper');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize animations
    animateOnScroll();

    // Re-run animations when user scrolls back up
    document.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('.image-text-section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            // If section is in viewport
            if (scrollPosition > sectionTop - window.innerHeight + 100 &&
                scrollPosition < sectionTop + sectionHeight) {
                const imageWrapper = section.querySelector('.image-wrapper');
                const contentWrapper = section.querySelector('.content-wrapper');

                if (!imageWrapper.classList.contains('animate') ||
                    !contentWrapper.classList.contains('animate')) {
                    imageWrapper.classList.add('animate');
                    contentWrapper.classList.add('animate');
                }
            }
        });
    });

    // Button click effect
    const button = document.querySelector('.section-button');
    if (button) {
        button.addEventListener('click', function () {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    }
});

//sectionn two js part

document.addEventListener('DOMContentLoaded', function () {
    // Animation on scroll function
    function animateOnScroll() {
        const elements = [
            ...document.querySelectorAll('.section-header'),
            ...document.querySelectorAll('.card'),
            document.querySelector('.section-footer')
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');

                    // Add staggered animation for cards
                    if (entry.target.classList.contains('card')) {
                        const index = Array.from(document.querySelectorAll('.card')).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    // Initialize animations
    animateOnScroll();

    // Button click effects
    const buttons = document.querySelectorAll('.card-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });

    // Re-trigger animations when scrolling back up
    window.addEventListener('scroll', function () {
        const section = document.querySelector('.cards-section');
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition > sectionTop - window.innerHeight + 100 &&
            scrollPosition < sectionTop + sectionHeight) {

            const header = document.querySelector('.section-header');
            const cards = document.querySelectorAll('.card');
            const footer = document.querySelector('.section-footer');

            if (!header.classList.contains('animate')) {
                header.classList.add('animate');
            }

            cards.forEach((card, index) => {
                if (!card.classList.contains('animate')) {
                    card.style.transitionDelay = `${index * 0.1}s`;
                    card.classList.add('animate');
                }
            });

            if (!footer.classList.contains('animate')) {
                footer.classList.add('animate');
            }
        }
    });
});

//sfeedback section js part

document.addEventListener('DOMContentLoaded', function () {
    const testimonials = document.querySelectorAll('.testimonial');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    // Show testimonial based on index
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active', 'prev', 'next');

            if (i === index) {
                testimonial.classList.add('active');
            } else if (i < index) {
                testimonial.classList.add('prev');
            } else if (i > index) {
                testimonial.classList.add('next');
            }
        });

        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
            if (i === index) {
                indicator.classList.add('active');
            }
        });
    }

    // Next testimonial
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Previous testimonial
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Click on indicator
    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            currentIndex = i;
            showTestimonial(currentIndex);
        });
    });

    // Button events
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);

    // Auto-rotate (optional)
    let autoRotate = setInterval(nextTestimonial, 5000);

    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });

    carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextTestimonial, 5000);
    });

    // Initialize
    showTestimonial(currentIndex);
});

// Footer Year Update
document.addEventListener('DOMContentLoaded', function () {
    // Update copyright year automatically
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }

    // Smooth scroll for footer links
    document.querySelectorAll('.footer-links a, .footer-services a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Footer book button click handler
    const footerBookBtn = document.querySelector('.footer-book-btn');
    if (footerBookBtn) {
        footerBookBtn.addEventListener('click', function () {
            // You can add your booking functionality here
            console.log('Booking button clicked');
            // Example: window.location.href = '/book';
        });
    }
});

