
        // Navbar scroll style
        const nav = document.getElementById('navbar');
        const toTop = document.getElementById('toTop');
        window.addEventListener('scroll', () => {
            const sc = window.scrollY > 20;
            nav.classList.toggle('scrolled', sc);
            toTop.classList.toggle('show', window.scrollY > 600);
        });

        // Mobile menu
        const burger = document.getElementById('burger');
        const navLinks = document.getElementById('navLinks');
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => {
                burger.classList.remove('open');
                navLinks.classList.remove('open');
            })
        );

        // Reveal on scroll
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));

        // Back to top
        toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    