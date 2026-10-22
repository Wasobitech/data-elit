document.addEventListener("DOMContentLoaded", function() {

    // --- Sidebar Handling ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const mainContentArea = document.querySelector('.content-scroller');
    const sidebarLinks = document.querySelectorAll('.nav-sidebar .nav-link');
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleSidebar);
    }

    // Close sidebar on desktop screen size automatically
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('open');
        }
    });


    // --- Scroll & Navigation Highlighting Logic ---
    const sections = document.querySelectorAll('.content-section');
    
    // Smooth scrolling to section from links
    function smoothScrollTo(targetLink) {
        const targetId = targetLink.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            mainContentArea.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            // Highlight the active link
            setActiveNav(targetLink);
            // Close sidebar on mobile
            if (window.innerWidth < 768) {
                sidebar.classList.remove('open');
            }
        }
    }

    // Highlight active link based on click
    function setActiveNav(clickedLink) {
        // Clear all active states in sidebar
        sidebarLinks.forEach(link => link.classList.remove('active'));
        // Clear all active states in bottom nav
        bottomNavLinks.forEach(link => link.classList.remove('active'));

        // Apply active to sidebar if clicked there
        const targetId = clickedLink.getAttribute('href');
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });

        // Apply active to bottom nav if clicked there
        bottomNavLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Add event listeners to all anchor links
    [...sidebarLinks, ...bottomNavLinks].forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Check if it's an anchor link starting with '#'
            if (targetId.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(this);
            }
        });
    });

    // Auto-update active link based on scroll position (Intersection Observer)
    const observerOptions = {
        root: mainContentArea,
        rootMargin: '0px',
        threshold: 0.7 // High threshold for single page behavior
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSectionId = entry.target.getAttribute('id');
                [...sidebarLinks, ...bottomNavLinks].forEach(link => {
                    if (link.getAttribute('href') === `#${activeSectionId}`) {
                        setActiveNav(link);
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

});