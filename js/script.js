/* Сергей Цараков — портфолио */
(function () {
    'use strict';

    const $ = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

    /* ---------- THEME TOGGLE ---------- */
    const root = document.documentElement;
    const themeBtn = $('#themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        root.classList.add('light');
        themeBtn.textContent = '🌙';
    }
    themeBtn.addEventListener('click', () => {
        const light = root.classList.toggle('light');
        themeBtn.textContent = light ? '🌙' : '☀️';
        localStorage.setItem('theme', light ? 'light' : 'dark');
    });

    /* ---------- NAVBAR / BURGER / TOTOP ---------- */
    const nav = $('#navbar');
    const toTop = $('#toTop');
    window.addEventListener('scroll', () => {
        const sc = window.scrollY > 20;
        nav.classList.toggle('scrolled', sc);
        toTop.classList.toggle('show', window.scrollY > 600);
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const burger = $('#burger');
    const navLinks = $('#navLinks');
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

    /* ---------- REVEAL ON SCROLL ---------- */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));

    /* ---------- STARS / PARTICLES ---------- */
    const canvas = $('#stars');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, stars = [];
        const isLight = () => root.classList.contains('light');
        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
            const n = Math.min(180, Math.floor(w * h / 7000));
            stars = Array.from({ length: n }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5 + 0.3,
                ph: Math.random() * Math.PI * 2,
                sp: Math.random() * 0.02 + 0.004
            }));
        };
        resize();
        window.addEventListener('resize', resize);
        (function tick() {
            ctx.clearRect(0, 0, w, h);
            for (const s of stars) {
                s.ph += s.sp;
                const o = 0.2 + 0.8 * Math.abs(Math.sin(s.ph));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = isLight()
                    ? 'rgba(30,70,120,' + (o * 0.5) + ')'
                    : 'rgba(220,235,255,' + o + ')';
                ctx.fill();
            }
            requestAnimationFrame(tick);
        })();
    }

    /* ---------- TERMINAL TYPING HELPER ---------- */
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // line spec: [type, text]  type: prompt | cmd | out | ok | warn | err | comment
    async function typeLines(el, lines, opts) {
        opts = opts || {};
        const speed = opts.speed || 14;
        const lineGap = opts.lineGap || 90;
        for (const [type, text] of lines) {
            const row = document.createElement('div');
            if (type === 'cmd') {
                const p = document.createElement('span');
                p.className = 'prompt';
                p.textContent = '$ ';
                const c = document.createElement('span');
                c.className = 'cmd';
                c.textContent = '';
                row.appendChild(p);
                row.appendChild(c);
                el.appendChild(row);
                for (let i = 0; i < text.length; i++) {
                    c.textContent += text[i];
                    el.scrollTop = el.scrollHeight;
                    await sleep(speed);
                }
            } else {
                row.className = type === 'out' ? 'out' : type;
                row.textContent = text;
                el.appendChild(row);
            }
            el.scrollTop = el.scrollHeight;
            await sleep(lineGap);
        }
        const cur = document.createElement('span');
        cur.className = 'cursor';
        el.appendChild(cur);
        el.scrollTop = el.scrollHeight;
    }

    /* ---------- HERO TERMINAL ---------- */
    const heroBody = $('#heroTermBody');
    if (heroBody) {
        heroBody.innerHTML = '<span class="comment">$ bash --login</span>';
        typeLines(heroBody, [
            ['cmd', 'cd ~/portfolio && ls'],
            ['out', 'about.md   projects/   skills.txt   contact.md'],
            ['cmd', 'cat about.md'],
            ['out', '> Сергей Цараков'],
            ['out', '> Python-разработчик · фрилансер'],
            ['out', '> боты · сайты · приложения · ИИ-агенты'],
            ['cmd', './deploy.sh --auto'],
            ['ok', '✓ MVP за 2-3 недели'],
            ['ok', '✓ RAG-бот для альпинистского магазина'],
            ['ok', '✓ NLP-словарь: 7000+ идиом'],
            ['ok', '✓ PDF-генератор с иллюстрациями'],
            ['cmd', 'git push origin live']
        ], { speed: 12, lineGap: 55 });
    }

    /* ---------- SKILLS TERMINAL (ls) ---------- */
    const skillsBody = $('#skillsTermBody');
    if (skillsBody) {
        typeLines(skillsBody, [
            ['cmd', 'ls -la ~/skills'],
            ['out', 'drwxr-xr-x  core/    Python, алгоритмы, архитектура'],
            ['out', 'drwxr-xr-x  web/     HTML, CSS, JS, Flask, GitHub Pages'],
            ['out', 'drwxr-xr-x  bots/    aiogram, VK, Salebot, webhooks'],
            ['out', 'drwxr-xr-x  data/    pandas, SQLite, NLTK, spacy, sklearn'],
            ['out', 'drwxr-xr-x  ai/      OpenAI API, RAG, агенты, gpt-image'],
            ['out', 'drwxr-xr-x  docs/    FPDF, reportlab, LaTeX, DOCX'],
            ['out', '-rw-r--r--  research  NLP, стилометрия, корпусный анализ']
        ], { speed: 8, lineGap: 40 });
    }

    /* ---------- COUNT-UP COUNTERS ---------- */
    const counters = $$('.count');
    if (counters.length) {
        const cio = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const el = e.target;
                cio.unobserve(el);
                const target = parseInt(el.dataset.target, 10) || 0;
                const dur = 1400;
                const start = performance.now();
                (function step(now) {
                    const t = Math.min(1, (now - start) / dur);
                    const eased = 1 - Math.pow(1 - t, 3);
                    el.textContent = Math.round(target * eased);
                    if (t < 1) requestAnimationFrame(step);
                })(start);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => cio.observe(c));
    }

    /* ---------- INTERACTIVE CHAT TERMINAL ---------- */
    const chatBody = $('#chatBody');
    const chatInput = $('#chatInput');
    if (chatBody && chatInput) {
        const botLines = (type, text) => {
            const row = document.createElement('div');
            row.className = type === 'out' ? 'out' : type;
            row.textContent = text;
            chatBody.appendChild(row);
            chatBody.scrollTop = chatBody.scrollHeight;
        };
        const userLine = (text) => {
            const row = document.createElement('div');
            const p = document.createElement('span');
            p.className = 'prompt';
            p.textContent = '$ ';
            const c = document.createElement('span');
            c.className = 'cmd';
            c.textContent = text;
            row.appendChild(p);
            row.appendChild(c);
            chatBody.appendChild(row);
            chatBody.scrollTop = chatBody.scrollHeight;
        };
        const replies = {
            help: ['Доступные команды:', '  whoami     — кто я', '  projects   — избранные проекты', '  services   — услуги', '  skills     — ключевые навыки', '  contact    — контакты', '  clear      — очистить терминал', 'Подсказка: команды можно кликать ниже.'],
            whoami: ['> Сергей Цараков', '> Выпускник кафедры прикладной математики', '> Системный программист, бывший преподаватель вуза', '> Сегодня: фрилансер (Python, боты, сайты, ИИ-агенты)'],
            projects: ['Избранные проекты:', '  1. TwoEras — лендинг + ИИ-ресепшн для аренды', '  2. Amadablam — RAG-бот магазина снаряжения', '  3. AI-Plant — PDF-книга английских идиом', '  4. BNC Search — корпусный поисковый движок', '  5. Alisa — автокнига с иллюстрациями', 'Подробнее — в разделе «Проекты» на сайте.'],
            services: ['Услуги:', '  • Python-разработка и автоматизация', '  • Чат-боты (Telegram, VK, виджеты)', '  • Сайты и лендинги', '  • ИИ-агенты и RAG-базы знаний', '  • Мобильные приложения', '  • Автоматизация документов (PDF, DOCX, LaTeX)'],
            skills: ['Ключевые навыки:', '  Python · aiogram · Flask · SQLite', '  pandas · NLTK · spaCy · sklearn', '  OpenAI API · RAG · gpt-image', '  FPDF · reportlab · LaTeX · DOCX', '  HTML · CSS · JS · GitHub Pages'],
            contact: ['Контакты:', '  Telegram: @SergeyTsarakov', '  Телефон: +7 911 033-49-95', '  Email: tehnoles2007@yandex.ru', '  GitHub: tehnoles2021-lab', 'Напишите — отвечаю быстро.']
        };
        const unknown = ['Команда не найдена.', 'Введите help для списка доступных команд.'];
        const welcome = ['Привет! Я — демо-терминал портфолио.', 'Введите help, чтобы увидеть список команд.'];

        welcome.forEach(t => botLines('out', t));

        const run = (raw) => {
            const cmd = (raw || '').trim().toLowerCase();
            if (!cmd) return;
            userLine(raw.trim());
            if (cmd === 'clear') {
                chatBody.innerHTML = '';
                return;
            }
            const out = replies[cmd] || unknown;
            botLines('comment', '');
            out.forEach(t => botLines(t.trim().startsWith('>') ? 'comment' : 'out', t));
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        const submit = () => {
            run(chatInput.value);
            chatInput.value = '';
        };
        chatInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') submit();
        });
        $$('.chat-quick button').forEach(b => {
            b.addEventListener('click', () => {
                run(b.dataset.cmd);
                chatInput.focus();
            });
        });
    }
})();
