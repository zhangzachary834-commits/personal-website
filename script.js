/**
 * ============================================================================
 * Zachary Zhang // Dimension of Thought — Client Scripts
 * Multi-Mode Personal Portfolio & Holistic Platform
 * Article Drafting Studio Engine & Dynamic Library
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeIcon = document.getElementById("theme-icon");

    // -------------------------------------------------------------------------
    // Theme Management
    // -------------------------------------------------------------------------
    const savedTheme =
        localStorage.getItem("dimension-theme") ||
        (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const current = htmlElement.getAttribute("data-theme") || "dark";
            setTheme(current === "dark" ? "light" : "dark");
        });
    }

    function setTheme(theme) {
        htmlElement.setAttribute("data-theme", theme);
        localStorage.setItem("dimension-theme", theme);
        if (themeIcon) themeIcon.textContent = theme === "dark" ? "☽" : "☀";
    }

    // -------------------------------------------------------------------------
    // Top-Left Dual Mode Switcher (Personal Portfolio <-> Dimension of Thought)
    // -------------------------------------------------------------------------
    const modePersonalBtn = document.getElementById("mode-personal-btn");
    const modeDimensionBtn = document.getElementById("mode-dimension-btn");
    const personalView = document.getElementById("mode-personal-view");
    const dimensionView = document.getElementById("mode-dimension-view");
    const navPersonal = document.getElementById("nav-menu-personal");
    const navDimension = document.getElementById("nav-menu-dimension");
    const vNavPersonal = document.getElementById("v-nav-personal");
    const vNavDimension = document.getElementById("v-nav-dimension");

    // Determine initial mode from URL param (?mode=...), or localStorage, default to 'personal'
    

        const urlParams = new URLSearchParams(window.location.search);
    const modeFromUrl = urlParams.get("mode");
    const savedMode = modeFromUrl || localStorage.getItem("dimension-site-mode") || "personal";

    function setSiteMode(mode) {
        const isPersonal = mode === "personal";
        localStorage.setItem("dimension-site-mode", mode);

        if (modePersonalBtn && modeDimensionBtn) {
            modePersonalBtn.classList.toggle("active", isPersonal);
            modePersonalBtn.setAttribute("aria-selected", String(isPersonal));
            modeDimensionBtn.classList.toggle("active", !isPersonal);
            modeDimensionBtn.setAttribute("aria-selected", String(!isPersonal));
        }

        if (personalView && dimensionView) {
            if (isPersonal) {
                personalView.classList.add("active-mode");
                dimensionView.classList.remove("active-mode");
                document.title = "Zachary Zhang — Personal Portfolio & Systems Architecture";
            } else {
                dimensionView.classList.add("active-mode");
                personalView.classList.remove("active-mode");
                document.title = "Dimension of Thought — Life Connections & Holistic Platform";
            }
        }

        if (navPersonal && navDimension) {
            navPersonal.style.display = isPersonal ? "flex" : "none";
            navDimension.style.display = isPersonal ? "none" : "flex";
        }

        if (vNavPersonal && vNavDimension) {
            vNavPersonal.style.display = isPersonal ? "flex" : "none";
            vNavDimension.style.display = isPersonal ? "none" : "flex";
        }

        handleScroll();
        if (typeof updateTerminalPromptUI === "function") updateTerminalPromptUI();
    }

    if (modePersonalBtn) {
        modePersonalBtn.addEventListener("click", () => {
            setSiteMode("personal");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (modeDimensionBtn) {
        modeDimensionBtn.addEventListener("click", () => {
            setSiteMode("dimension");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // -------------------------------------------------------------------------
    // Typewriter Effects for Both Modes
    // -------------------------------------------------------------------------
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setupTypewriter(elementId, phrases) {
        const el = document.getElementById(elementId);
        if (!el) return;
        if (reduceMotion) {
            el.textContent = phrases[0];
            return;
        }

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let speed = 70;

        function step() {
            const current = phrases[phraseIndex];
            if (isDeleting) {
                el.textContent = current.slice(0, charIndex - 1);
                charIndex--;
                speed = 32;
            } else {
                el.textContent = current.slice(0, charIndex + 1);
                charIndex++;
                speed = 68;
            }

            if (!isDeleting && charIndex === current.length) {
                speed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 380;
            }
            setTimeout(step, speed);
        }
        step();
    }

    setupTypewriter("p-typewriter-text", [
        "Person-centered ontology architect",
        "Computer Science & Mathematics",
        "Creator of Earthcall (C++20 · WebGPU · OntoMath)",
        "Robotics VLA & Spatial Perception",
        "One Person. Many First Movers."
    ]);

    setupTypewriter("d-typewriter-text", [
        "A holistic digital space for all aspects of humanity",
        "Forming the constellation of life and community",
        "The Holistic Narrative Continuum",
        "You don't prove persons. You encounter them.",
        "Writers of Light: Giving words to the heart"
    ]);

    // -------------------------------------------------------------------------
    // Navigation & Scroll Tracking
    // -------------------------------------------------------------------------
    const navbar = document.getElementById("navbar");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const scrollProgressBar = document.getElementById("scroll-progress");
    const backToTopBtn = document.getElementById("back-to-top");

    // Set initial mode on page load
    setSiteMode(savedMode);

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            const currentNav = localStorage.getItem("dimension-site-mode") === "dimension" ? navDimension : navPersonal;
            if (currentNav) {
                const linksList = currentNav.querySelector(".nav-links");
                if (linksList) {
                    const isOpen = linksList.classList.toggle("open");
                    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
                }
            }
        });

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                document.querySelectorAll(".nav-links").forEach((ul) => ul.classList.remove("open"));
                if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "false");
            });
        });
    }

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollProgressBar && scrollHeight > 0) {
            scrollProgressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
        }
        if (navbar) navbar.classList.toggle("scrolled", scrollTop > 28);
        if (backToTopBtn) backToTopBtn.classList.toggle("show", scrollTop > 420);

        const currentMode = localStorage.getItem("dimension-site-mode") || "personal";
        const isPersonal = currentMode === "personal";

        // Update active nav and vertical scroll dots
        const activeContainer = isPersonal ? personalView : dimensionView;
        if (!activeContainer) return;

        const sections = activeContainer.querySelectorAll("section[id]");
        let currentId = isPersonal ? "p-home" : "d-home";

        sections.forEach((sec) => {
            if (scrollTop >= sec.offsetTop - 220) {
                currentId = sec.id;
            }
        });

        const activeVNav = isPersonal ? vNavPersonal : vNavDimension;
        if (activeVNav) {
            activeVNav.querySelectorAll(".v-nav-link").forEach((link) => {
                const target = link.getAttribute("data-target");
                link.classList.toggle("active", target === currentId);
            });
        }

        const activeNavMenu = isPersonal ? navPersonal : navDimension;
        if (activeNavMenu) {
            activeNavMenu.querySelectorAll(".nav-link").forEach((link) => {
                const href = link.getAttribute("href");
                if (href && href.startsWith("#")) {
                    link.classList.toggle("active", href === `#${currentId}`);
                }
            });
        }
    }
    handleScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // -------------------------------------------------------------------------
    // Project Category Filtering (Personal Mode)
    // -------------------------------------------------------------------------
    const projectFilterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    projectFilterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            projectFilterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");

            projectCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                const matches = filter === "all" || category === filter;
                card.style.display = matches ? "flex" : "none";
            });
        });
    });

    // -------------------------------------------------------------------------
    // Dynamic Custom Published Articles Loader
    // -------------------------------------------------------------------------
    function initDynamicCustomArticles() {
        const essaysGrid = document.querySelector(".essays-grid");
        if (!essaysGrid) return;

        let published = [];
        try {
            published = JSON.parse(localStorage.getItem("dimension_custom_articles") || "[]");
        } catch (e) {
            published = [];
        }

        if (!Array.isArray(published) || published.length === 0) return;

        published.forEach((art) => {
            const articleId = art.id || ("custom-" + art.slug);
            if (document.querySelector('[data-essay-id="' + articleId + '"]')) return;

            const card = document.createElement("article");
            card.className = "essay-card";
            card.setAttribute("data-category", art.category || "ontology");
            card.setAttribute("data-essay-id", articleId);
            if (art.concepts && art.concepts.length > 0) {
                card.setAttribute("data-concepts", art.concepts.join(","));
            }

            const catLabels = {
                ontology: "Epistemology · Relational Ontology",
                narrative: "Culture & Narrative Ethics",
                reflections: "Life Reflections & Evowth",
                systems: "Systems Architecture & OntoMath",
                robotics: "Robotics & Spatial AI"
            };
            const catLabel = catLabels[art.category] || "Original Inquiry";
            const readTime = art.readTime || "5 min read";
            const author = art.author || "Zachary Zhang";
            const previewUrl = "posts/" + (art.slug || "article") + ".html";

            card.innerHTML = `
                <div class="essay-meta">
                    <span class="essay-tag">${catLabel}</span>
                    <span class="essay-read-time">${readTime}</span>
                </div>
                <h3 class="essay-title"><a href="${previewUrl}">${art.title || "Untitled Essay"}</a></h3>
                <p class="essay-subtitle">${art.subtitle || ""}</p>
                <p class="essay-excerpt">${art.excerpt || (art.content ? art.content.slice(0, 180) + "..." : "Read the complete drafted inquiry.")}</p>
                <div class="essay-card-footer">
                    <span class="essay-author">By ${author}</span>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <a href="${previewUrl}" class="btn btn-small btn-primary">Read Full Essay →</a>
                    </div>
                </div>
            `;

            essaysGrid.prepend(card);
        });

        initCardSpotlights();
    }
    initDynamicCustomArticles();

    // -------------------------------------------------------------------------
    // Essay Category Filtering (The Library Page)
    // -------------------------------------------------------------------------
    function initEssayFilters() {
        const essayFilterBtns = document.querySelectorAll(".essay-filter-btn");
        const cards = document.querySelectorAll(".essay-card");

        essayFilterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                essayFilterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.getAttribute("data-filter");

                cards.forEach((card) => {
                    const category = card.getAttribute("data-category");
                    const matches = filter === "all" || category === filter;
                    card.style.display = matches ? "flex" : "none";
                });
            });
        });
    }
    initEssayFilters();

    // -------------------------------------------------------------------------
    // Interactive Card Spotlight Hover Tracker
    // -------------------------------------------------------------------------
    function initCardSpotlights() {
        const interactiveCards = document.querySelectorAll(
            ".stat-card, .now-card, .project-card, .pillar-card, .skill-category-card, .story-card, .manifesto-card, .essay-card, .initiative-card, .contact-item-card, .draft-item-card, .template-card"
        );

        interactiveCards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", x + "px");
                card.style.setProperty("--mouse-y", y + "px");
            });
        });
    }
    initCardSpotlights();

    // -------------------------------------------------------------------------
    // Constellation Canvas Animation & Interactive Particle Field
    // -------------------------------------------------------------------------
    const canvas = document.getElementById("global-bg-canvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const constellationLabels = [
        "Person", "Story", "Dialogue", "Continuum", "Relation",
        "Writers of Light", "Earthcall", "Community", "Wisdom", "Constellation"
    ];
    let stars = [];
    let bgStars = [];
    let nebulae = [];
    let time = 0;
    let mousePos = { x: -1000, y: -1000, active: false };

    function resizeConstellation() {
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initStars() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const count = Math.min(Math.floor(w / 18), 120);

        stars = [];
        for (let i = 0; i < count; i++) {
            const hasLabel = i < constellationLabels.length;
            const isTeal = i % 3 === 0;
            const isPurple = i % 3 === 1;
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                radius: hasLabel ? 3.4 : Math.random() * 1.5 + 0.5,
                label: hasLabel ? constellationLabels[i] : null,
                isTeal: isTeal,
                isPurple: isPurple,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                orbitOffset: Math.random() * Math.PI * 2,
                pulseEnergy: 0,
                pulseTarget: 0,
                pulseState: 0,
                pulseJumps: 0,
                pulseHue: 0
            });
        }

        const bgCount = Math.min(Math.floor(w / 4), 500);
        bgStars = [];
        for (let i = 0; i < bgCount; i++) {
            bgStars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.04,
                vy: (Math.random() - 0.5) * 0.04,
                radius: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.015 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                colorIndex: i % 3
            });
        }

        nebulae = [];
        for (let i = 0; i < 5; i++) {
            nebulae.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 400 + 250,
                colorIndex: i % 3
            });
        }
    }

    if (canvas) {
        window.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.clientY <= rect.bottom && e.clientY >= rect.top) {
                mousePos.x = e.clientX - rect.left;
                mousePos.y = e.clientY - rect.top;
                mousePos.active = true;
            } else {
                mousePos.active = false;
            }
        });

        window.addEventListener("click", (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.clientY <= rect.bottom && e.clientY >= rect.top) {
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;

                if (!window.cursorPulses) window.cursorPulses = [];
                if (!window.extraTethers) window.extraTethers = [];

                let hoverStars = stars.filter(s => Math.hypot(s.x - mx, s.y - my) < 130);
                const rand = Math.random();
                let numStrands = 1;
                if (rand > 0.4) numStrands = 2;
                if (rand > 0.7) numStrands = 3;
                if (rand > 0.9) numStrands = 4;
                if (rand > 0.97) numStrands = 5;

                let potentialNew = stars.filter(s => {
                    let d = Math.hypot(s.x - mx, s.y - my);
                    return d >= 130 && d < 380;
                }).sort(() => Math.random() - 0.5).slice(0, numStrands);

                for (let s of potentialNew) {
                    window.extraTethers.push({ target: s, life: 1.0 });
                }

                let allPulsed = hoverStars.concat(potentialNew);
                for (const s of allPulsed) {
                    window.cursorPulses.push({
                        target: s,
                        progress: 0,
                        speed: 0.035 + Math.random() * 0.02
                    });
                }
            }
        });
    }

    function drawConstellation() {
        if (!ctx || !canvas || reduceMotion) return;
        time += 1;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        ctx.clearRect(0, 0, w, h);

        const isDark = htmlElement.getAttribute("data-theme") !== "light";
        const goldColor = isDark ? "rgba(216, 180, 110," : "rgba(242, 133, 41,";
        const tealColor = isDark ? "rgba(110, 231, 216," : "rgba(14, 153, 204,";
        const purpleColor = isDark ? "rgba(168, 85, 247," : "rgba(224, 61, 137,";
        const labelColor = isDark ? "rgba(247, 243, 235, 0.6)" : "rgba(24, 21, 16, 0.6)";

        const cascadeStartHue = isDark ? 170 : 195;
        const cascadeHueShift = isDark ? 8 : 10;
        const cascadeSat = isDark ? 85 : 90;
        const cascadeLit = isDark ? 65 : 52;

        ctx.globalCompositeOperation = isDark ? "screen" : "source-over";
        for (const n of nebulae) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -n.r || n.x > w + n.r) n.vx *= -1;
            if (n.y < -n.r || n.y > h + n.r) n.vy *= -1;

            const baseColor = n.colorIndex === 0 ? goldColor : (n.colorIndex === 1 ? tealColor : purpleColor);
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
            const maxAlpha = isDark ? 0.12 : 0.20; // Slightly stronger in Light Mode to compensate for source-over
            grad.addColorStop(0, `${baseColor} ${maxAlpha})`);
            grad.addColorStop(1, `${baseColor} 0)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }
        ctx.globalCompositeOperation = "source-over";

        for (const s of bgStars) {
            s.x += s.vx;
            s.y += s.vy;
            if (s.x < -10) s.x = w + 10;
            if (s.x > w + 10) s.x = -10;
            if (s.y < -10) s.y = h + 10;
            if (s.y > h + 10) s.y = -10;

            const blink = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.5 + 0.5;
            const colorStr = s.colorIndex === 0 ? goldColor : (s.colorIndex === 1 ? tealColor : purpleColor);

            ctx.fillStyle = `${colorStr} ${0.1 + blink * 0.25})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * (0.5 + blink * 0.5), 0, Math.PI * 2);
            ctx.fill();
        }

        if (Math.random() < 0.003 && stars.length > 0) {
            const randStar = stars[Math.floor(Math.random() * stars.length)];
            if (randStar.pulseState === 0) {
                randStar.pulseTarget = Math.random() * 0.5 + 0.5;
                randStar.pulseEnergy = 0.05;
                randStar.pulseState = 1;
                randStar.pulseJumps = Math.floor(Math.random() * 12) + 4;
                randStar.pulseHue = cascadeStartHue;
                
                const redChance = 0.15 + Math.sin(time * 0.001) * 0.10; // shifts from 5% to 25%
                if (Math.random() < redChance) {
                    randStar.redJumpsLeft = Math.floor(Math.random() * 2) + 2; // 2 or 3 jumps to reach red
                    const goReverse = Math.random() < 0.5;
                    const distToRed = goReverse ? -cascadeStartHue : (360 - cascadeStartHue);
                    randStar.pulseShift = distToRed / randStar.redJumpsLeft;
                } else {
                    randStar.redJumpsLeft = 0;
                    const isRainbow = Math.random() < 0.1;
                    let shift = isRainbow ? 25 : cascadeHueShift;
                    const isReverse = isRainbow ? (Math.random() < 0.5) : (Math.random() < 0.15);
                    randStar.pulseShift = isReverse ? -shift : shift;
                }
            }
        }

        for (const s of stars) {
            if (s.pulseState === 1) {
                s.pulseEnergy += 0.04;
                if (s.pulseEnergy >= s.pulseTarget) {
                    s.pulseEnergy = s.pulseTarget;
                    s.pulseState = 2;
                }
            } else if (s.pulseState === 2) {
                s.pulseEnergy -= 0.008;
                if (s.pulseEnergy <= 0) {
                    s.pulseEnergy = 0;
                    s.pulseState = 0;
                }
            }

            s.x += s.vx;
            s.y += s.vy;
            if (s.x < -10) s.x = w + 10;
            if (s.x > w + 10) s.x = -10;
            if (s.y < -10) s.y = h + 10;
            if (s.y > h + 10) s.y = -10;

            if (mousePos.active) {
                const dx = s.x - mousePos.x;
                const dy = s.y - mousePos.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 120 && dist > 1) {
                    const force = (120 - dist) / 120 * 0.5;
                    s.x += (dx / dist) * force;
                    s.y += (dy / dist) * force;
                }
            }
        }

        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const a = stars[i];
                const b = stars[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                const maxDist = w > 768 ? 160 : 100;

                if (dist < maxDist) {
                    let cascadeAlpha = 0;

                    if (a.pulseState !== 0 || b.pulseState !== 0) {
                        cascadeAlpha = Math.max(a.pulseEnergy, b.pulseEnergy);

                        if (a.pulseEnergy > 0.5 && a.pulseJumps > 0 && b.pulseState === 0) {
                            if (Math.random() < 0.08) {
                                b.pulseTarget = Math.random() * 0.4 + 0.6;
                                b.pulseEnergy = 0.05;
                                b.pulseState = 1;
                                b.pulseJumps = a.pulseJumps - 1;
                                
                                b.redJumpsLeft = Math.max(0, (a.redJumpsLeft || 0) - 1);
                                b.pulseShift = a.pulseShift || cascadeHueShift;
                                b.pulseHue = (a.pulseHue + b.pulseShift + 360) % 360;
                                
                                if ((a.redJumpsLeft || 0) > 0 && b.redJumpsLeft === 0) {
                                    const isRainbow = Math.random() < 0.1;
                                    let shift = isRainbow ? 25 : cascadeHueShift;
                                    const isReverse = isRainbow ? (Math.random() < 0.5) : (Math.random() < 0.15);
                                    b.pulseShift = isReverse ? -shift : shift;
                                }
                                
                                a.pulseJumps = Math.floor(a.pulseJumps / 2.5);
                            }
                        } else if (b.pulseEnergy > 0.5 && b.pulseJumps > 0 && a.pulseState === 0) {
                            if (Math.random() < 0.08) {
                                a.pulseTarget = Math.random() * 0.4 + 0.6;
                                a.pulseEnergy = 0.05;
                                a.pulseState = 1;
                                a.pulseJumps = b.pulseJumps - 1;
                                
                                a.redJumpsLeft = Math.max(0, (b.redJumpsLeft || 0) - 1);
                                a.pulseShift = b.pulseShift || cascadeHueShift;
                                a.pulseHue = (b.pulseHue + a.pulseShift + 360) % 360;
                                
                                if ((b.redJumpsLeft || 0) > 0 && a.redJumpsLeft === 0) {
                                    const isRainbow = Math.random() < 0.1;
                                    let shift = isRainbow ? 25 : cascadeHueShift;
                                    const isReverse = isRainbow ? (Math.random() < 0.5) : (Math.random() < 0.15);
                                    a.pulseShift = isReverse ? -shift : shift;
                                }
                                
                                b.pulseJumps = Math.floor(b.pulseJumps / 2.5);
                            }
                        }
                    }

                    const organicFade = Math.sin(time * 0.006 + a.orbitOffset + b.orbitOffset) * 0.5 + 0.5;
                    const baseAlpha = (1 - dist / maxDist) * 0.45;
                    let alpha = baseAlpha * organicFade;

                    if (cascadeAlpha > 0) {
                        alpha = Math.max(alpha, cascadeAlpha * 0.9);
                    }

                    if (alpha > 0.01) {
                        if (cascadeAlpha > 0.1) {
                            const hueA = a.pulseState !== 0 ? a.pulseHue : b.pulseHue;
                            const hueB = b.pulseState !== 0 ? b.pulseHue : a.pulseHue;

                            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                            grad.addColorStop(0, `hsla(${hueA}, ${cascadeSat}%, ${cascadeLit}%, ${alpha})`);
                            grad.addColorStop(1, `hsla(${hueB}, ${cascadeSat}%, ${cascadeLit}%, ${alpha})`);
                            ctx.strokeStyle = grad;
                            ctx.lineWidth = 1.6;
                        } else {
                            ctx.strokeStyle = `${goldColor} ${alpha})`;
                            ctx.lineWidth = 1.0;
                        }

                        const cx = (a.x + b.x) / 2 + Math.sin(time * 0.02 + a.orbitOffset) * 45;
                        const cy = (a.y + b.y) / 2 + Math.cos(time * 0.02 + b.orbitOffset) * 45;

                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.quadraticCurveTo(cx, cy, b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        }

        if (mousePos.active && w > 600) {
            let activeTethers = [];
            for (const s of stars) {
                const dist = Math.hypot(s.x - mousePos.x, s.y - mousePos.y);
                if (dist < 130) {
                    activeTethers.push({ target: s, dist: dist, alphaMultiplier: 1.0 });
                }
            }
            if (window.extraTethers) {
                for (let i = window.extraTethers.length - 1; i >= 0; i--) {
                    let et = window.extraTethers[i];
                    et.life -= 0.015;
                    if (et.life <= 0) {
                        window.extraTethers.splice(i, 1);
                    } else {
                        const dist = Math.hypot(et.target.x - mousePos.x, et.target.y - mousePos.y);
                        if (dist >= 130) {
                            activeTethers.push({ target: et.target, dist: dist, alphaMultiplier: et.life });
                        }
                    }
                }
            }

            for (const t of activeTethers) {
                const s = t.target;
                const dist = t.dist;

                let baseAlpha = 0;
                let baseThickness = 1.0;
                if (t.alphaMultiplier === 1.0 && dist < 130) {
                    baseAlpha = (1 - dist / 130) * 0.6;
                    baseThickness = 1.0 + (1 - dist / 130) * 1.5;
                } else {
                    baseAlpha = 0.4 * t.alphaMultiplier;
                    baseThickness = 1.0 + t.alphaMultiplier;
                }

                const starColorMatch = s.isTeal ? tealColor : (s.isPurple ? purpleColor : goldColor);

                const normalGrad = ctx.createLinearGradient(mousePos.x, mousePos.y, s.x, s.y);
                normalGrad.addColorStop(0, `hsla(${cascadeStartHue}, ${cascadeSat}%, ${cascadeLit}%, 0)`);
                normalGrad.addColorStop(0.3, `hsla(${cascadeStartHue}, ${cascadeSat}%, ${cascadeLit}%, ${baseAlpha * 0.3})`);
                normalGrad.addColorStop(1, `${starColorMatch} ${baseAlpha})`);

                ctx.strokeStyle = normalGrad;
                ctx.beginPath();
                ctx.moveTo(mousePos.x, mousePos.y);
                ctx.lineTo(s.x, s.y);

                ctx.lineWidth = baseThickness * 3.0;
                ctx.globalAlpha = 0.3;
                ctx.stroke();

                ctx.lineWidth = baseThickness * 0.8;
                ctx.globalAlpha = 1.0;
                ctx.stroke();

                let activePulse = window.cursorPulses ? window.cursorPulses.find(p => p.target === s) : null;
                if (activePulse) {
                    let cp = activePulse.progress;
                    let fade = cp > 1.0 ? Math.max(0, 1.0 - (cp - 1.0) / 1.5) : 1.0;

                    if (fade > 0) {
                        const pulseBaseAlpha = Math.min(1.0, baseAlpha + 0.3);
                        const pulseGrad = ctx.createLinearGradient(mousePos.x, mousePos.y, s.x, s.y);
                        const safeStop = (offset, color) => pulseGrad.addColorStop(Math.max(0, Math.min(1, offset)), color);

                        safeStop(0, `hsla(180, 100%, 70%, 0)`);
                        safeStop(cp - 0.45, `hsla(180, 100%, 70%, ${pulseBaseAlpha * 0.4})`);
                        safeStop(cp - 0.15, `hsla(220, 100%, 75%, ${Math.min(1.0, pulseBaseAlpha * 1.5)})`);
                        safeStop(cp + 0.05, `hsla(260, 100%, 85%, 1)`);
                        safeStop(cp + 0.35, `hsla(280, 100%, 70%, ${pulseBaseAlpha * 0.4})`);
                        safeStop(1, `hsla(280, 100%, 70%, 0)`);

                        ctx.strokeStyle = pulseGrad;
                        ctx.beginPath();
                        ctx.moveTo(mousePos.x, mousePos.y);
                        ctx.lineTo(s.x, s.y);

                        let thicknessBulge = Math.sin(Math.min(1, cp) * Math.PI) * 3.0;
                        ctx.lineWidth = baseThickness * 3.0 + thicknessBulge;
                        ctx.globalAlpha = 0.3 * fade;
                        ctx.stroke();

                        ctx.lineWidth = baseThickness * 0.8 + (thicknessBulge * 0.4);
                        ctx.globalAlpha = 1.0 * fade;
                        ctx.stroke();
                        ctx.globalAlpha = 1.0;
                    }
                }
            }
        }

        ctx.font = "11px 'IBM Plex Mono', monospace";
        for (const s of stars) {
            const blink = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.5 + 0.5;
            const colorStr = s.isTeal ? tealColor : (s.isPurple ? purpleColor : goldColor);

            let starAlpha = 0.3 + blink * 0.7;
            let starRadius = s.radius * (0.5 + blink * 0.5);
            if (s.pulseEnergy > 0) {
                starAlpha = Math.max(starAlpha, s.pulseEnergy);
                starRadius += s.pulseEnergy * 2.0;
                ctx.fillStyle = `hsla(${s.pulseHue}, ${cascadeSat}%, ${cascadeLit}%, ${starAlpha})`;
                ctx.shadowColor = `hsla(${s.pulseHue}, ${cascadeSat}%, ${cascadeLit}%, 1)`;
            } else {
                ctx.fillStyle = `${colorStr} ${starAlpha})`;
                ctx.shadowColor = `${colorStr} 1)`;
            }

            ctx.shadowBlur = (blink * 12) + (s.pulseEnergy * 20);
            ctx.beginPath();
            ctx.arc(s.x, s.y, starRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            if (s.label && w > 800) {
                ctx.fillStyle = labelColor;
                ctx.fillText(s.label, s.x + 8, s.y - 8);
            }
        }

        if (window.cursorPulses) {
            for (let i = window.cursorPulses.length - 1; i >= 0; i--) {
                let p = window.cursorPulses[i];
                p.progress += p.speed;

                if (p.progress >= 1.0 && !p.ignited) {
                    p.ignited = true;
                    p.target.pulseTarget = 1.0;
                    p.target.pulseEnergy = 0.5;
                    p.target.pulseState = 1;
                    p.target.pulseJumps = Math.floor(Math.random() * 12) + 6;
                    p.target.pulseHue = cascadeStartHue;
                    
                    const redChance = 0.15 + Math.sin(time * 0.001) * 0.10;
                    if (Math.random() < redChance) {
                        p.target.redJumpsLeft = Math.floor(Math.random() * 2) + 2;
                        const goReverse = Math.random() < 0.5;
                        const distToRed = goReverse ? -cascadeStartHue : (360 - cascadeStartHue);
                        p.target.pulseShift = distToRed / p.target.redJumpsLeft;
                    } else {
                        p.target.redJumpsLeft = 0;
                        const isRainbow = Math.random() < 0.1;
                        let shift = isRainbow ? 25 : cascadeHueShift;
                        const isReverse = isRainbow ? (Math.random() < 0.5) : (Math.random() < 0.15);
                        p.target.pulseShift = isReverse ? -shift : shift;
                    }
                }

                if (p.progress >= 2.5) {
                    window.cursorPulses.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(drawConstellation);
    }

    if (canvas && ctx && !reduceMotion) {
        resizeConstellation();
        initStars();
        drawConstellation();
        window.addEventListener("resize", () => {
            resizeConstellation();
            initStars();
        });
    }

    // -------------------------------------------------------------------------
    // Toast & Copy Email
    // -------------------------------------------------------------------------
    const toast = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");
    let toastTimeout;

    document.querySelectorAll(".copy-email-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const email = btn.getAttribute("data-email") || "zhangzachary834@gmail.com";
            try {
                await navigator.clipboard.writeText(email);
                showToast(`Copied ${email} to clipboard!`);
            } catch (e) {
                showToast(email);
            }
        });
    });

    function showToast(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
    }

    // -------------------------------------------------------------------------
    // Quick Composer Forms
    // -------------------------------------------------------------------------
    const personalForm = document.getElementById("personal-email-form");
    if (personalForm) {
        personalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("p-form-name")?.value || "";
            const subject = document.getElementById("p-form-subject")?.value || "Connection";
            const message = document.getElementById("p-form-message")?.value || "";
            const mailtoSubject = `[Zachary Zhang Site] ${subject} (from ${name})`;
            const mailtoBody = `Name: ${name}

Message:
${message}

---
Sent via zacharyzhang.dev`;
            window.location.href = `mailto:zhangzachary834@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
        });
    }

    const dimForm = document.getElementById("dim-email-form");
    if (dimForm) {
        dimForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("d-form-name")?.value || "";
            const topic = document.getElementById("d-form-topic")?.value || "General";
            const subject = document.getElementById("d-form-subject")?.value || "Dimension Connection";
            const message = document.getElementById("d-form-message")?.value || "";
            const mailtoSubject = `[Dimension of Thought — ${topic}] ${subject} (from ${name})`;
            const mailtoBody = `Name: ${name}
Topic: ${topic}

Message:
${message}

---
Sent via Dimension of Thought Platform`;
            window.location.href = `mailto:zhangzachary834@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
        });
    }

    // -------------------------------------------------------------------------
    // Interactive Terminal CLI
    // -------------------------------------------------------------------------
    const terminalToggleBtn = document.getElementById("terminal-toggle-btn");
    const terminalModal = document.getElementById("terminal-modal");
    const terminalCloseBtn = document.getElementById("terminal-close-btn");
    const terminalBackdrop = document.getElementById("terminal-backdrop");
    const terminalInput = document.getElementById("terminal-input");
    const terminalOutput = document.getElementById("terminal-output");
    const commandHistory = [];
    let historyIndex = -1;

    function getPromptLabel() {
        const mode = localStorage.getItem("dimension-site-mode") || "personal";
        return mode === "personal" ? "guest@zachary:~$" : "guest@dimension:~$";
    }

    function updateTerminalPromptUI() {
        const promptText = getPromptLabel();
        const promptLabels = document.querySelectorAll(".term-prompt");
        promptLabels.forEach((el) => {
            el.textContent = promptText;
        });
        const termTitle = document.getElementById("terminal-title");
        if (termTitle) {
            const mode = localStorage.getItem("dimension-site-mode") || "personal";
            termTitle.textContent = mode === "personal"
                ? "zachary@personal-substrate — cli"
                : "zachary@dimension-of-thought — cli";
        }
    }

    function openTerminal() {
        if (!terminalModal) return;
        updateTerminalPromptUI();
        terminalModal.removeAttribute("hidden");
        terminalModal.style.display = "flex";
        if (terminalInput) setTimeout(() => terminalInput.focus(), 50);
    }

    function closeTerminal() {
        if (!terminalModal) return;
        terminalModal.setAttribute("hidden", "");
        terminalModal.style.display = "none";
    }

    if (terminalToggleBtn) terminalToggleBtn.addEventListener("click", openTerminal);
    if (terminalCloseBtn) terminalCloseBtn.addEventListener("click", closeTerminal);
    if (terminalBackdrop) terminalBackdrop.addEventListener("click", closeTerminal);

    function isTypingTarget(el) {
        if (!el) return false;
        const tag = el.tagName;
        return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && terminalModal && !terminalModal.hasAttribute("hidden") && terminalModal.style.display !== "none") {
            closeTerminal();
            return;
        }
        const backtick = e.key === "`" || e.key === "~" || (e.ctrlKey && e.key === "`");
        if (backtick && !isTypingTarget(document.activeElement)) {
            e.preventDefault();
            if (terminalModal.hasAttribute("hidden") || terminalModal.style.display === "none") openTerminal();
            else closeTerminal();
        }
    });

    const AUTOCOMPLETE_LIST = [
        "help", "specs", "neofetch", "sysinfo", "benchmark", "bench", "stack", "arch",
        "tree", "ontology", "earthcall-tree", "robotics", "jaka", "vla", "sat", "physics",
        "skills", "tech", "cv", "resume", "now", "projects", "earthcall", "whoami", "about",
        "manifesto", "story", "essays", "writers", "contact", "theme", "history", "date",
        "clear", "exit", "draft", "studio", "drafts", "new-post", "matrix", "sudo",
        "mode personal", "mode dimension",
        "read persons", "read valley", "read continuum", "read sadako", "read dignity",
        "read music", "read discipleship", "read kpop", "read evowth",
        "cat earthcall", "cat robotics", "cat jaka", "cat sat", "cat teacherops", "cat bridge",
        "goto home", "goto story", "goto manifesto", "goto library", "goto ecosystem", "goto contact", "goto studio",
        "open p-home", "open p-now", "open p-earthcall", "open p-work", "open p-about", "open p-skills", "open p-contact"
    ];

    if (terminalInput && terminalOutput) {
        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const raw = terminalInput.value.trim();
                if (raw) {
                    commandHistory.push(raw);
                    historyIndex = commandHistory.length;
                    executeCommand(raw);
                }
                terminalInput.value = "";
            } else if (e.key === "ArrowUp") {
                if (commandHistory.length && historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                    e.preventDefault();
                }
            } else if (e.key === "ArrowDown") {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = "";
                }
                e.preventDefault();
            } else if (e.key === "Tab") {
                e.preventDefault();
                const cur = terminalInput.value.trimStart().toLowerCase();
                if (!cur) return;
                const matches = AUTOCOMPLETE_LIST.filter(c => c.toLowerCase().startsWith(cur));
                if (matches.length === 1) {
                    terminalInput.value = matches[0];
                } else if (matches.length > 1) {
                    let prefix = matches[0];
                    for (let m of matches) {
                        while (!m.toLowerCase().startsWith(prefix.toLowerCase()) && prefix.length > 0) {
                            prefix = prefix.slice(0, -1);
                        }
                    }
                    if (prefix.length > cur.length) {
                        terminalInput.value = prefix;
                    } else {
                        print(`${getPromptLabel()} ${terminalInput.value}`, "term-prompt-echo");
                        print(matches.join("   "), "term-cyan");
                        const body = document.getElementById("terminal-body");
                        if (body) body.scrollTop = body.scrollHeight;
                    }
                }
            }
        });
    }

    const COMMANDS = {
        help: () => {
            print("✧ Zachary Zhang // Interactive CLI Substrate", "term-cmd-highlight");
            print("--------------------------------------------------------------------", "term-dim");
            print("⚙️  Systems & Architecture Commands:", "term-accent");
            [
                "specs / neofetch — workstation, runtime substrates & research specs",
                "benchmark / bench— run live in-browser MatMul & 3D SAT collision bench",
                "stack / arch    — multi-tier architecture diagram (Person to Vessel)",
                "tree / ontology — Earthcall file tree & load-bearing refusals",
                "robotics / jaka — OpenVLA-OFT manipulator pipeline & RealSense vision",
                "sat / physics   — C++20 Separating Axis Theorem collision engine",
                "skills / tech   — categorized technical proficiencies matrix"
            ].forEach(l => print("  " + l));

            print("📁 Projects & Artifacts:", "term-accent");
            [
                "projects        — overview of selected systems & tools",
                "cat <project>   — deep-dive (earthcall, robotics, sat, teacherops, bridge)",
                "now             — what I'm actively building right now (2026)",
                "cv / resume     — summary of research, education & background"
            ].forEach(l => print("  " + l));

            print("✧ Dimension & Thought Platform:", "term-accent");
            [
                "mode <name>     — switch view mode ('mode personal' or 'mode dimension')",
                "earthcall       — overview of the C++20/WebGPU computational ontology",
                "essays          — list essays in The Library archive",
                "read <id>       — open an essay (e.g. 'read persons', 'read valley')",
                "manifesto       — core philosophy & holistic continuum",
                "story           — origin story & building in public",
                "draft / studio  — open the visual Article Drafting Studio",
                "drafts          — list browser-stored article drafts"
            ].forEach(l => print("  " + l));

            print("💻 Shell & Utilities:", "term-accent");
            [
                "theme           — toggle dark / light mode",
                "history         — view session command history",
                "matrix          — stream ontological data feed",
                "date            — display current system time",
                "echo <text>     — print text to terminal output",
                "sudo <cmd>      — request elevated authority",
                "clear           — clear terminal screen",
                "exit            — close terminal window"
            ].forEach(l => print("  " + l));
            print("Tip: Press TAB to autocomplete commands & project names.", "term-dim");
        },

        specs: () => {
            print("       /\          zachary@los-angeles", "term-cyan");
            print("      /  \         -------------------", "term-cyan");
            print("     / /\ \        OS: macOS Darwin (Apple Silicon) / Ubuntu 24.04 (CUDA)", "term-cyan");
            print("    / ____ \       Role: CS & Mathematics · Systems & Ontology Architect", "term-cyan");
            print("   /_/    \_\      Substrates: C++20, WebGPU (WGSL), WebAssembly, Python 3.12+", "term-cyan");
            print("                    Robotics: OpenVLA-OFT (7B VLA), RealSense D435i, AprilTag 3, JAKA Zu 7", "term-accent");
            print("                    Ontology: Earthcall (Runtime Laws, OntoMath, Retes, No Domain Classes)", "term-gold");
            print("                    Math Focus: Linear Algebra, Convex Optimization, Multivariable Calculus", "term-purple");
            print("                    Toolchains: Clang 18, CMake, PyTorch 2.4, FastAPI, SQLite", "term-sub");
            print("                    Uptime: 2026.08 // Active Systems Research", "term-success");
        },
        neofetch: () => COMMANDS.specs(),
        sysinfo: () => COMMANDS.specs(),

        benchmark: () => {
            print("⚡ Initiating Live In-Browser Substrate Micro-Benchmark...", "term-cmd-highlight");
            print("Executing floating-point tensor arithmetic & continuous 3D SAT tests...");

            // 1. Float32 Tensor Matrix Multiplication (128x128 dense matmul, 150 iterations)
            const N = 128;
            const itersMat = 150;
            const A = new Float32Array(N * N);
            const B = new Float32Array(N * N);
            const C = new Float32Array(N * N);
            for (let i = 0; i < N * N; i++) {
                A[i] = Math.random();
                B[i] = Math.random();
            }
            const t0 = performance.now();
            for (let it = 0; it < itersMat; it++) {
                for (let i = 0; i < N; i++) {
                    const iN = i * N;
                    for (let k = 0; k < N; k++) {
                        const a = A[iN + k];
                        const kN = k * N;
                        for (let j = 0; j < N; j++) {
                            C[iN + j] += a * B[kN + j];
                        }
                    }
                }
            }
            const t1 = performance.now();
            const matTime = Math.max(0.1, t1 - t0);
            const totalFlops = 2 * N * N * N * itersMat;
            const gflops = (totalFlops / (matTime / 1000) / 1e9).toFixed(2);

            // 2. 3D SAT Continuous Collision Projection (100,000 queries)
            const itersSAT = 100000;
            const t2 = performance.now();
            let collisionCount = 0;
            const boxHalf = new Float32Array([1.0, 1.5, 0.8]);
            const posA = new Float32Array([0, 0, 0]);
            const posB = new Float32Array([0.5, 1.2, 0.3]);
            for (let it = 0; it < itersSAT; it++) {
                const dx = Math.abs(posB[0] - posA[0]);
                const dy = Math.abs(posB[1] - posA[1]);
                const dz = Math.abs(posB[2] - posA[2]);
                if (dx <= boxHalf[0] * 2 && dy <= boxHalf[1] * 2 && dz <= boxHalf[2] * 2) {
                    collisionCount++;
                }
            }
            const t3 = performance.now();
            const satTime = Math.max(0.1, t3 - t2);
            const satMops = ((itersSAT / (satTime / 1000)) / 1e6).toFixed(2);

            print("┌────────────────────────────────────────────────────────────────┐", "term-dim");
            print(`│ [1] Float32 Dense MatMul (128x128 x ${itersMat} iterations)             │`, "term-cyan");
            print(`│     Execution Time: ${matTime.toFixed(2)} ms | Throughput: ${gflops} GFLOPS (JS JIT)       │`, "term-accent");
            print("├────────────────────────────────────────────────────────────────┤", "term-dim");
            print(`│ [2] Continuous 3D SAT Projections (100,000 test queries)       │`, "term-cyan");
            print(`│     Execution Time: ${satTime.toFixed(2)} ms | Rate: ${satMops} Mops/sec                 │`, "term-accent");
            print("└────────────────────────────────────────────────────────────────┘", "term-dim");
            print("✔ Benchmark complete. Substrate client responsive.", "term-success");
            print("Ontological Takeaway: Raw compute is secondary; runtime Law networks order the engine.", "term-dim");
        },
        bench: () => COMMANDS.benchmark(),

        stack: () => {
            print("✦ Zachary Zhang // Systems & Substrate Architecture Stack:", "term-cmd-highlight");
            print("┌────────────────────────────────────────────────────────────────────────┐", "term-dim");
            print("│                          PERSON (Human Being)                          │", "term-gold");
            print("│         Ground of authority, intention, and telos. Body root.          │", "term-sub");
            print("├────────────────────────────────────────────────────────────────────────┤", "term-dim");
            print("│                       FIRST MOVERS (AI Agents)                         │", "term-cyan");
            print("│      Generative agents coordinate & write C++, but are not Persons.    │", "term-sub");
            print("├────────────────────────────────────────────────────────────────────────┤", "term-dim");
            print("│                           ONTOLOGY LAYER                               │", "term-accent");
            print("│      ConstructedBeing · Relation · Formations · Identity · Zones       │", "term-sub");
            print("├────────────────────────────────────────────────────────────────────────┤", "term-dim");
            print("│                            LAW NETWORK                                 │", "term-purple");
            print("│      Runtime-authored OntoMath compilation · Rete-style evaluation     │", "term-sub");
            print("├────────────────────────────────────────────────────────────────────────┤", "term-dim");
            print("│                            SINGULARITY                                 │", "term-warn");
            print("│      Hardware channels · Remote CUDA IPC · Permission gateways         │", "term-sub");
            print("├────────────────────────────────────────────────────────────────────────┤", "term-dim");
            print("│                          VESSEL RUNTIME                                │", "term-welcome");
            print("│      C++20 Substrate · WebGPU (WGSL) · WebAssembly · Python Bridge     │", "term-sub");
            print("└────────────────────────────────────────────────────────────────────────┘", "term-dim");
        },
        arch: () => COMMANDS.stack(),

        tree: () => {
            print("✦ Earthcall Ontology Repository Hierarchy:", "term-cmd-highlight");
            print("Earthcall/", "term-accent");
            print("├── Person/              <-- Load-bearing: Human beings only; Body root", "term-gold");
            print("├── ConstructedBeing/    <-- In-world authored entities & structures", "term-cyan");
            print("├── Relation/            <-- Pure relational ontological bindings", "term-cyan");
            print("├── Identity/            <-- Teleological continuity & persistent self", "term-cyan");
            print("├── ZonesOfEarth/        <-- Spatial volumes & regional law contexts", "term-cyan");
            print("├── Singularity/         <-- Hardware channels, foreign IPC, CUDA bridge", "term-purple");
            print("└── Vessel/              <-- C++20 kernel, WebGPU pipeline, WASM runtime", "term-welcome");
            print("");
            print("Architectural Refusal:", "term-warn");
            print("No domain entity classes (no class Tree, no class Vehicle).");
            print("What a thing is is authored in-world from registered property paths governed by runtime Laws.");
        },
        ontology: () => COMMANDS.tree(),
        "earthcall-tree": () => COMMANDS.tree(),

        robotics: () => {
            print("✦ Robotics Perception & Manipulator Pipeline:", "term-cmd-highlight");
            print("• Model:       OpenVLA-OFT (7B Vision-Language-Action inference)");
            print("• Execution:   macOS orchestration -> Remote CUDA GPU cluster over socket IPC");
            print("• Vision:      Intel RealSense D435i (Color + Depth point clouds)");
            print("• Spatial Cal: AprilTag 3 coordinate transformations & tracker frame calibration");
            print("• Arm:         JAKA Zu 7 (6-DOF collaborative arm) teleoperation & live jog loop");
            print("• Dashboard:   Live Web/Python teleop controller with joint limits & safety gates");
            print("Type 'cat robotics' for the full technical breakdown.", "term-dim");
        },
        jaka: () => COMMANDS.robotics(),
        vla: () => COMMANDS.robotics(),

        sat: () => {
            print("✦ Continuous SAT 3D Collision Detection Engine:", "term-cmd-highlight");
            print("• Core Theory: Separating Axis Theorem for arbitrary 3D convex polyhedra");
            print("• Implementation: Modern C++20 with zero runtime dynamic allocations in inner loops");
            print("• Axis Tests:  Face normals of A, face normals of B, plus cross-products of edge directions");
            print("• Manifold:    Contact manifold extraction with minimal penetration depth & normal resolution");
            print("• Role:        Substrate physics for Earthcall's OntoMath spatial layer");
            print("Type 'cat sat' for the full technical breakdown.", "term-dim");
        },
        physics: () => COMMANDS.sat(),

        skills: () => {
            print("✦ Technical Proficiencies & Disciplines:", "term-cmd-highlight");
            print("1. Low-Level Systems:   C++20, WebGPU (WGSL), WebAssembly, Clang 18, CMake, POSIX IPC, Linux", "term-accent");
            print("2. Robotics & Spatial:  OpenVLA-OFT, PyTorch, Intel RealSense SDK, AprilTag 3, Kinematics", "term-cyan");
            print("3. Applied Mathematics: Linear Algebra, Convex Geometry, Multivariable Calculus, Rete Networks", "term-gold");
            print("4. Tools & Full-Stack:  Python, FastAPI, SQLite, TypeScript/JavaScript, CSS3/Modern Web", "term-welcome");
        },
        tech: () => COMMANDS.skills(),

        cv: () => {
            print("✦ Zachary Zhang // Curriculum Vitae Summary", "term-cmd-highlight");
            print("--------------------------------------------------------------------", "term-dim");
            print("Education:  Computer Science & Mathematics · UCLA", "term-cyan");
            print("Focus:      Systems Architecture, Computational Ontology, Robotics VLA", "term-accent");
            print("Key Work:   Earthcall Substrate (C++20/WebGPU), OpenVLA JAKA Pipeline, SAT Collision Engine", "term-gold");
            print("Principles: 1. Ontology before Engine | 2. Math as Language of Law | 3. Person Means Human", "term-sub");
            print("Contact:    zhangzachary834@gmail.com | github.com/zhangzachary834-commits", "term-accent");
            print("--------------------------------------------------------------------", "term-dim");
            print("Type 'contact' for social channels or 'projects' to inspect systems.", "term-dim");
        },
        resume: () => COMMANDS.cv(),

        now: () => {
            print("✦ Present Tense // What I'm Building Now (2026):", "term-cmd-highlight");
            print("1. Earthcall Authoring Surface — Turning Creator Console tools into First Movers (GUI as Law).", "term-cyan");
            print("2. JAKA Arm + OpenVLA-OFT — Remote CUDA vision-language-action teleoperation with RealSense.", "term-accent");
            print("3. Multi-Agent Substrates — Orchestrating coding agents against a formal ontology ('One Person, Many First Movers').", "term-gold");
        },

        cat: (arg) => {
            const key = (arg || "").trim().toLowerCase();
            if (key === "earthcall") {
                print("✦ Earthcall Deep-Dive:", "term-cmd-highlight");
                print("A Person-centered computational ontology that orders the engine attached to it.");
                print("• Top-level source tree is the ontology (Person, ConstructedBeing, Relation, Singularity).");
                print("• Beings authored at runtime; behavior compiled through Rete-style Law networks.");
                print("• WebGPU/C++20/WASM/Python foreign IPC vessel.");
                print("• GitHub: https://github.com/zhangzachary834-commits/Earthcall");
            } else if (key === "robotics" || key === "jaka" || key === "vla") {
                print("✦ Vision Pipeline & JAKA Arm Deep-Dive:", "term-cmd-highlight");
                print("Full stack for manipulator perception and teleoperation control.");
                print("• OpenVLA-OFT vision-language-action model running on remote CUDA.");
                print("• Intel RealSense color+depth point cloud registration & AprilTag pose calibration.");
                print("• Live teleoperation dashboard jogging 6-DOF JAKA manipulator in real time.");
            } else if (key === "sat" || key === "physics") {
                print("✦ SAT Physics Engine Deep-Dive:", "term-cmd-highlight");
                print("Continuous 3D convex polyhedron collision detection & contact manifold generator.");
                print("• Built in modern C++20 using Separating Axis Theorem (SAT).");
                print("• Evaluates face normals and cross-product edge pairs for complete separation checking.");
            } else if (key === "teacherops") {
                print("✦ TeacherOps Deep-Dive:", "term-cmd-highlight");
                print("Local FastAPI + SQLite assistant for a family tutoring hub.");
                print("• Teacher matching, parent inquiry management, follow-ups, and drafted coordination.");
                print("• Human-in-the-loop: Automation stops where human judgment begins.");
                print("• GitHub: https://github.com/zhangzachary834-commits/teacherops");
            } else if (key === "bridge") {
                print("✦ Sandbox-to-Terminal Bridge Deep-Dive:", "term-cmd-highlight");
                print("Bidirectional bridge connecting isolated AI sandboxes with local macOS terminal workflows.");
                print("• Automated command execution, file sync, and human-gated approvals.");
            } else {
                print(`Unknown target: '${arg}'. Try: 'cat earthcall', 'cat robotics', 'cat sat', 'cat teacherops', 'cat bridge'`, "term-error");
            }
        },
        info: (arg) => COMMANDS.cat(arg),

        draft: () => {
            closeTerminal();
            window.location.href = "studio.html";
        },
        studio: () => {
            closeTerminal();
            window.location.href = "studio.html";
        },
        "new-post": () => {
            closeTerminal();
            window.location.href = "studio.html?new=true";
        },
        drafts: () => {
            print("📑 Saved Article Drafts:", "term-cmd-highlight");
            let drafts = [];
            try {
                drafts = JSON.parse(localStorage.getItem("dimension_drafts_v1") || "[]");
            } catch (e) {
                drafts = [];
            }
            if (drafts.length === 0) {
                print("  No drafts found. Type 'draft' to compose your first essay.");
            } else {
                drafts.forEach((d, idx) => {
                    print(`  ${idx + 1}. [${d.category || "General"}] ${d.title || "Untitled"} (${new Date(d.updatedAt || Date.now()).toLocaleDateString()})`);
                });
                print("Type 'draft' to open the studio.");
            }
        },
        mode: (arg) => {
            const m = (arg || "").trim().toLowerCase();
            if (m === "personal" || m === "portfolio" || m === "zach") {
                setSiteMode("personal");
                updateTerminalPromptUI();
                print("Switched to Zachary Zhang's Personal Portfolio Mode", "term-cmd-highlight");
            } else if (m === "dimension" || m === "thought") {
                setSiteMode("dimension");
                updateTerminalPromptUI();
                print("Switched to Dimension of Thought Platform Mode", "term-cmd-highlight");
            } else {
                const cur = localStorage.getItem("dimension-site-mode") || "personal";
                const next = cur === "personal" ? "dimension" : "personal";
                setSiteMode(next);
                updateTerminalPromptUI();
                print(`Switched mode to ${next}`, "term-cmd-highlight");
            }
        },
        personal: () => {
            setSiteMode("personal");
            updateTerminalPromptUI();
            print("Switched to Zachary Zhang's Personal Portfolio", "term-cmd-highlight");
        },
        dimension: () => {
            setSiteMode("dimension");
            updateTerminalPromptUI();
            print("Switched to Dimension of Thought Platform", "term-cmd-highlight");
        },
        earthcall: () => {
            print("Earthcall Substrate", "term-cmd-highlight");
            print("Person-centered computational ontology with a C++20/WebGPU vessel.");
            print("Repository: https://github.com/zhangzachary834-commits/Earthcall");
        },
        projects: () => {
            print("Selected Projects:", "term-cmd-highlight");
            print("1. Earthcall (C++20, WebGPU, WASM, Rete Laws)", "term-cyan");
            print("2. Vision Pipeline & JAKA Arm (OpenVLA-OFT, RealSense, AprilTag)", "term-accent");
            print("3. SAT Physics & Continuous Collision Engine (C++20)", "term-gold");
            print("4. TeacherOps (FastAPI, SQLite family tutoring platform)", "term-welcome");
            print("Tip: Type 'cat <project>' for detailed architecture specs.", "term-dim");
        },
        whoami: () => {
            print("Zachary Zhang", "term-cmd-highlight");
            print("Computer Science & Mathematics · Systems & Ontology Architect");
            print("Based in Los Angeles, California");
        },
        about: () => {
            print("About Zachary Zhang", "term-cmd-highlight");
            print("Building software that represents beings as they actually are.");
            print("Core Principles: 1. Ontology before Engine | 2. Math as Language of Law | 3. Reach is Total; Authority is Gated");
        },
        manifesto: () => {
            print("Constitutional Manifesto", "term-cmd-highlight");
            print("• Beyond Lines & Squares: Reimagining social software around the human soul.");
            print("• Holistic Narrative Continuum: Reality as a unified grand story.");
            print("• Living Knowledge: True truth is truth that makes life good and beautiful.");
            print("Visit manifesto.html for the complete text.");
        },
        story: () => {
            print("The Story of Dimension of Thought", "term-cmd-highlight");
            print("Created by Zach to connect disconnected spheres of life.");
            print("Philosophy: Publishing the construction site so we can build our shared vision together.");
            print("Visit story.html for the complete text.");
        },
        essays: () => {
            print("The Library & Archives:", "term-cmd-highlight");
            print("1. persons       — You Don't Prove Persons (Epistemology)");
            print("2. valley        — The Tale of the Central Valley & UCLA's Quiet Revolution");
            print("3. continuum     — The Holistic Narrative Continuum");
            print("4. sadako        — Justice, Love, and Life for Sadako (Redemption Arc)");
            print("5. dignity       — Personhood Transcends Function (Moral Ontology)");
            print("6. music         — Music: The Essence of Experiential Story");
            print("7. discipleship  — Is AI's Training Data Really Just 'Data'? Or Discipleship?");
            print("8. kpop          — Embracing Art as the Person in K-Pop");
            print("9. evowth        — Pathways of Evowth: Evolution vs. Purposeful Growth");
            print("Type 'read <name>' to open any essay page.");
        },
        read: (arg) => {
            const map = {
                "1": "posts/you-dont-prove-persons.html",
                "persons": "posts/you-dont-prove-persons.html",
                "person": "posts/you-dont-prove-persons.html",
                "2": "posts/central-valley-ucla.html",
                "valley": "posts/central-valley-ucla.html",
                "3": "posts/narrative-continuum.html",
                "continuum": "posts/narrative-continuum.html",
                "4": "posts/why-sadako-needs-redemption-arc.html",
                "sadako": "posts/why-sadako-needs-redemption-arc.html",
                "horror": "posts/why-sadako-needs-redemption-arc.html",
                "redemption": "posts/why-sadako-needs-redemption-arc.html",
                "5": "posts/personhood-consciousness.html",
                "dignity": "posts/personhood-consciousness.html",
                "6": "posts/music-and-culture.html",
                "music": "posts/music-and-culture.html",
                "7": "posts/ai-training-data-discipleship.html",
                "ai": "posts/ai-training-data-discipleship.html",
                "discipleship": "posts/ai-training-data-discipleship.html",
                "8": "posts/art-as-the-person-kpop.html",
                "kpop": "posts/art-as-the-person-kpop.html",
                "art": "posts/art-as-the-person-kpop.html",
                "9": "posts/pathways-of-evowth.html",
                "evowth": "posts/pathways-of-evowth.html",
                "growth": "posts/pathways-of-evowth.html"
            };
            const targetUrl = map[(arg || "").trim().toLowerCase()];
            if (targetUrl) {
                closeTerminal();
                window.location.href = targetUrl;
            } else {
                print(`Unknown essay: '${arg}'. Type 'essays' to view list.`, "term-error");
            }
        },
        writers: () => {
            print("Writers of Light", "term-cmd-highlight");
            print("Experienced writers ready to help you flesh out the words of your heart.");
            print("Completely free — starting with the heart, not with economy.");
        },
        contact: () => {
            print("Email:    zhangzachary834@gmail.com");
            print("GitHub:   https://github.com/zhangzachary834-commits");
            print("LinkedIn: https://www.linkedin.com/in/zachary-of-zhang/");
        },
        theme: () => {
            const current = htmlElement.getAttribute("data-theme") || "dark";
            const next = current === "dark" ? "light" : "dark";
            setTheme(next);
            print(`Theme toggled to ${next}`, "term-cmd-highlight");
        },
        history: () => {
            print("✦ Session Command History:", "term-cmd-highlight");
            if (commandHistory.length === 0) {
                print("  (No commands recorded in this session)", "term-dim");
            } else {
                commandHistory.forEach((c, idx) => {
                    print(`  ${String(idx + 1).padStart(3, " ")}  ${c}`);
                });
            }
        },
        matrix: () => {
            print("Initializing Ontological Data Feed...", "term-success");
            const glyphs = ["Person", "OntoMath", "C++20", "WebGPU", "Law", "Relation", "Singularity", "VLA", "SAT", "FirstMover", "0", "1", "✧"];
            let lines = 0;
            const interval = setInterval(() => {
                let stream = "";
                for (let i = 0; i < 6; i++) {
                    stream += glyphs[Math.floor(Math.random() * glyphs.length)] + "  ";
                }
                print(stream, "term-cyan");
                const body = document.getElementById("terminal-body");
                if (body) body.scrollTop = body.scrollHeight;
                lines++;
                if (lines >= 7) {
                    clearInterval(interval);
                    print("Feed stable. Substrate operational.", "term-dim");
                    if (body) body.scrollTop = body.scrollHeight;
                }
            }, 90);
        },
        sudo: (arg) => {
            print("sudo: Permission denied.", "term-error");
            print("In Earthcall, human authority (Person) is foundational and cannot be delegated to automated telemetry.", "term-dim");
        },
        date: () => {
            print(new Date().toString(), "term-accent");
        },
        echo: (arg) => {
            print(arg || "");
        },
        clear: () => {
            terminalOutput.innerHTML = "";
        },
        exit: () => closeTerminal()
    };

    function executeCommand(cmdStr) {
        print(`${getPromptLabel()} ${cmdStr}`, "term-prompt-echo");
        const parts = cmdStr.trim().split(/\s+/);
        const head = parts[0].toLowerCase();
        const arg = parts.slice(1).join(" ");

        if (head === "goto" || head === "cd" || head === "open") {
            const dest = (arg || "home").replace(/^#/, "").toLowerCase();
            const pageMap = {
                "home": "index.html",
                "story": "story.html",
                "manifesto": "manifesto.html",
                "library": "library.html",
                "essays": "library.html",
                "studio": "studio.html",
                "draft": "studio.html",
                "ecosystem": "ecosystem.html",
                "earthcall": "ecosystem.html",
                "contact": "contact.html",
                "dialogue": "contact.html"
            };

            if (pageMap[dest]) {
                closeTerminal();
                window.location.href = pageMap[dest];
            } else {
                const el = document.getElementById(dest);
                if (el) {
                    closeTerminal();
                    el.scrollIntoView({ behavior: "smooth" });
                } else {
                    print(`Destination not found: '${dest}'.`, "term-error");
                }
            }
        } else if (head === "read") {
            COMMANDS.read(arg);
        } else if (head === "mode") {
            COMMANDS.mode(arg);
        } else if (head === "cat" || head === "info") {
            COMMANDS.cat(arg);
        } else if (COMMANDS[head]) {
            COMMANDS[head](arg);
        } else {
            print(`Command not found: '${cmdStr}'. Type 'help' for available commands.`, "term-error");
        }

        const body = document.getElementById("terminal-body");
        if (body) body.scrollTop = body.scrollHeight;
    }

    function print(text, className = "") {
        const p = document.createElement("p");
        p.className = `term-line ${className}`;
        p.textContent = text;
        terminalOutput.appendChild(p);
    }


    // =========================================================================
    // Article Drafting Studio Core Engine
    // =========================================================================
    function initStudioEngine() {
        const workspace = document.getElementById("studio-workspace");
        if (!workspace) return;

        const titleInput = document.getElementById("studio-title");
        const subtitleInput = document.getElementById("studio-subtitle");
        const categoryInput = document.getElementById("studio-category");
        const slugInput = document.getElementById("studio-slug");
        const authorInput = document.getElementById("studio-author");
        const excerptInput = document.getElementById("studio-excerpt");
        const tagsInput = document.getElementById("studio-tags");
        const bodyInput = document.getElementById("studio-body");

        // Preview Elements
        const prevTitle = document.getElementById("prev-title");
        const prevSubtitle = document.getElementById("prev-subtitle");
        const prevTag = document.getElementById("prev-tag");
        const prevAuthor = document.getElementById("prev-author");
        const prevMetaTime = document.getElementById("prev-meta-time");
        const prevProseBody = document.getElementById("prev-prose-body");

        // Metric Indicators
        const wordCountEl = document.getElementById("metric-word-count");
        const readTimeEl = document.getElementById("metric-read-time");
        const saveStatusText = document.getElementById("save-status-text");
        const statusIndicatorDot = document.querySelector(".status-indicator-dot");
        const draftsCountBadge = document.getElementById("drafts-count-badge");

        // View Mode Elements
        const splitLayout = document.getElementById("studio-split-layout");
        const viewSplitBtn = document.getElementById("view-split-btn");
        const viewEditorBtn = document.getElementById("view-editor-btn");
        const viewPreviewBtn = document.getElementById("view-preview-btn");

        // Drawer Elements
        const draftsDrawer = document.getElementById("drafts-drawer");
        const draftsBackdrop = document.getElementById("drafts-drawer-backdrop");
        const openDraftsBtn = document.getElementById("open-drafts-drawer-btn");
        const closeDraftsBtn = document.getElementById("close-drafts-drawer-btn");
        const draftsListContainer = document.getElementById("drafts-list-container");
        const createNewDraftBtn = document.getElementById("create-new-draft-btn");

        // Templates Modal
        const templatesModal = document.getElementById("templates-modal-backdrop");
        const openTemplatesBtn = document.getElementById("open-templates-btn");
        const closeTemplatesBtn = document.getElementById("close-templates-modal-btn");

        // Export Dropdown
        const exportMenuBtn = document.getElementById("export-menu-btn");
        const exportDropdown = document.getElementById("export-dropdown");
        const exportHtmlBtn = document.getElementById("export-html-btn");
        const exportMdBtn = document.getElementById("export-md-btn");
        const copyHtmlBodyBtn = document.getElementById("copy-html-body-btn");
        const publishBtn = document.getElementById("publish-article-btn");
        const clearBtn = document.getElementById("clear-editor-btn");

        // Templates Blueprint Dictionary
        const TEMPLATES = {
            ontology: {
                title: "The Architecture of Personal Reality",
                subtitle: "Why Relational Ontology Must Precede Mechanistic Computation",
                category: "ontology",
                slug: "architecture-of-personal-reality",
                excerpt: "An ontological inquiry into why systems must represent persons as relational beings rather than deterministic state machines.",
                tags: "Ontology, Epistemology, Systems",
                body: "<span class=\"drop-cap\">T</span>o build software that honors the human soul, we must begin not with mechanics, but with reality itself. Modern computing frequently collapses into functionalism: treating entities solely by what they output rather than what they are.\n\n## The Axiom of the Person\n\nA Person cannot be reduced to an isolated object. Personal existence is inherently relational, conscious, and teleological.\n\n> \u201cTo know a being as a Person is not to measure its parts from afar, but to enter relation.\u201d\n\n## Dialectic Breakdown\n\nWhen we construct platforms that treat words as sterile tokens, we strip language of its relational weight. We must invert the stack: ontology comes before the engine."
            },
            narrative: {
                title: "Light in the Darkest Wells",
                subtitle: "Redemption, Narrative Dignity, and the Ethics of Human Storytelling",
                category: "narrative",
                slug: "light-in-the-darkest-wells",
                excerpt: "Analyzing the modern narrative landscape and why justice demands redemption rather than the glorification of tragedy.",
                tags: "Culture, Narrative Ethics, Storytelling",
                body: "<span class=\"drop-cap\">E</span>very culture reveals its deepest moral commitments through the stories it tells. When horror and tragedy are left unresolved, art ceases to be a beacon and becomes an echo chamber of despair.\n\n## The Call for Redemption\n\nGenuine justice refuses to delight in destruction. The highest calling of narrative is to bring redemption into the most desolate spaces.\n\n> \u201cArt is not a detached observer; it is the heartbeat of human conscience.\u201d\n\n## Cultural Synthesis\n\nWe must tell stories that carry light without flinching from the dark."
            },
            evowth: {
                title: "The Discipline of Intentional Flourishing",
                subtitle: "Moving Beyond Reactive Survival into Purposeful Moral Growth",
                category: "reflections",
                slug: "discipline-of-intentional-flourishing",
                excerpt: "Reflections on Evowth: how human purpose transforms adversity into enduring relational maturity.",
                tags: "Life Reflections, Evowth, Purpose",
                body: "<span class=\"drop-cap\">B</span>iological survival is reactive: organisms mutate in response to environmental shocks. But human flourishing\u2014what we call **Evowth**\u2014is fundamentally intentional.\n\n## The Distinction\n\n- **Evolution**: Reactive adaptation driven by external pressures.\n- **Evowth**: Purposeful inward growth rooted in moral vision and love.\n\n> \u201cFlourishing is not the absence of trials, but the integration of adversity into enduring purpose.\u201d\n\n## The Daily Synthesis\n\nTo live in Evowth is to make each daily choice an act of deliberate creation."
            },
            systems: {
                title: "Formal Rules and Ontological Invariants",
                subtitle: "Synthesizing Rete Forward-Chaining with C++20 and WebGPU Computing",
                category: "systems",
                slug: "formal-rules-and-ontological-invariants",
                excerpt: "Designing computation where mathematical laws protect personhood invariants at compile-time and runtime.",
                tags: "C++20, WebGPU, Compilers, OntoMath",
                body: "<span class=\"drop-cap\">I</span>n traditional graphics and engine architecture, state is mutable and unverified. By integrating formal ontological rules directly into the engine, we ensure invariants are preserved across distributed execution.\n\n## The Substrate Invariant\n\n```cpp\ntemplate <typename Entity>\nconcept PersonSubstrate = requires(Entity e) {\n    { e.relational_id() } -> std::same_as<uint64_t>;\n    { e.has_moral_agency() } -> std::same_as<bool>;\n};\n```\n\n## Conclusion\n\nMath is the language of law; the engine is merely its faithful vessel."
            }
        };

        // Storage helpers
        function getDrafts() {
            try {
                const stored = localStorage.getItem("dimension_drafts_v1");
                if (stored) return JSON.parse(stored);
            } catch (e) {
                return [];
            }
            return [];
        }

        function saveDrafts(drafts) {
            localStorage.setItem("dimension_drafts_v1", JSON.stringify(drafts));
            if (draftsCountBadge) draftsCountBadge.textContent = String(drafts.length);
        }

        function getActiveDraftId() {
            return localStorage.getItem("dimension_active_draft_id");
        }

        function setActiveDraftId(id) {
            localStorage.setItem("dimension_active_draft_id", id);
        }

        let drafts = getDrafts();
        let activeId = getActiveDraftId();

        const loadParam = urlParams.get("load");
        const newParam = urlParams.get("new");

        if (newParam === "true") {
            const newDraft = createDraftObject("Untitled Essay", "A new inquiry into truth and meaning...");
            drafts.unshift(newDraft);
            saveDrafts(drafts);
            activeId = newDraft.id;
            setActiveDraftId(activeId);
        } else if (loadParam) {
            activeId = loadParam;
            setActiveDraftId(activeId);
        } else if (drafts.length === 0) {
            const seed = {
                id: "draft_" + Date.now(),
                title: "You Don't Prove Persons",
                subtitle: "The Category Error Hiding Inside \"There's No Scientific Evidence for God\"",
                category: "ontology",
                slug: "you-dont-prove-persons",
                author: "Zachary Zhang",
                date: "Jun 3, 2025",
                readTime: "9 min read",
                excerpt: "“Extraordinary claims require extraordinary evidence.” It sounds rigorous and scientific. But applying empirical object-metrics to personal reality is a profound category error.",
                tags: "Epistemology, Relational Ontology",
                content: "<span class=\"drop-cap\">H</span>ere is the claim, stated as strongly and cleanly as it can be stated: *\u201cExtraordinary claims require extraordinary evidence. The existence of God is an extraordinary claim. No sufficient empirical evidence has been provided. Therefore, belief in God is unwarranted.\u201d*\n\nThis sounds reasonable. It sounds rigorous. But applying empirical object-metrics to personal reality is a profound **category error**\u2014and not a minor one.\n\n## The Distinction Between Objects and Persons\n\nScience is a glorious tool designed to examine **objects**\u2014things that can be isolated, repeated, manipulated, and dissected under controlled conditions without their consent.\n\nA **Person**, however, cannot be proven through the epistemology of detachment.\n\n> \u201cPersons are not proven through physical dissection. Personal reality is encountered through relation, trust, and mutual communion.\u201d\n\n## The Catastrophe of Scientism\n\nWhen modern secular thought insists that only empirical measurements count as evidence, it doesn't just eliminate God\u2014it inadvertently eliminates the human person. You do not prove a Person from afar; you step forward and enter the dialogue.",
                updatedAt: Date.now(),
                isPublished: true
            };
            drafts.push(seed);
            saveDrafts(drafts);
            activeId = seed.id;
            setActiveDraftId(activeId);
        }

        let currentDraft = drafts.find(d => d.id === activeId) || drafts[0];

        function createDraftObject(title = "Untitled Essay", subtitle = "") {
            return {
                id: "draft_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                title: title,
                subtitle: subtitle,
                category: "ontology",
                slug: slugify(title),
                author: "Zachary Zhang",
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                readTime: "1 min read",
                excerpt: "",
                tags: "",
                content: "",
                updatedAt: Date.now(),
                isPublished: false
            };
        }

        function slugify(text) {
            return (text || "")
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-") || "my-essay";
        }

        function loadDraftIntoEditor(draft) {
            currentDraft = draft;
            setActiveDraftId(draft.id);

            titleInput.value = draft.title || "";
            subtitleInput.value = draft.subtitle || "";
            categoryInput.value = draft.category || "ontology";
            slugInput.value = draft.slug || slugify(draft.title);
            authorInput.value = draft.author || "Zachary Zhang";
            excerptInput.value = draft.excerpt || "";
            tagsInput.value = draft.tags || "";
            bodyInput.value = draft.content || "";

            updateLivePreview();
            renderDraftsList();
        }

        function parseMarkdown(md) {
            if (!md) return "<p class='lead-text' style='color: var(--muted); font-style: italic;'>Start typing in the editor on the left to see your formatted essay live here.</p>";

            const NL = String.fromCharCode(10);
            let html = md;
            html = html.replace(/<span class=["']drop-cap["']>([\s\S]*?)<\/span>/gi, "___DROPCAP_$1___");
            html = html.replace(new RegExp("```([a-z]*)" + NL + "([\s\S]*?)```", "g"), (match, lang, code) => {
                return "<pre><code>" + escapeHtml(code.trim()) + "</code></pre>";
            });
            html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
            html = html.replace(/^#### (.*$)/gim, "<h5>$1</h5>");
            html = html.replace(/^### (.*$)/gim, "<h4>$1</h4>");
            html = html.replace(/^## (.*$)/gim, "<h3>$1</h3>");
            html = html.replace(/^# (.*$)/gim, "<h2>$1</h2>");
            html = html.replace(/^\> (.*$)/gim, "<blockquote><p>$1</p></blockquote>");
            html = html.replace(/^(?:---|[*]{3}|___)$/gim, "<hr class='essay-divider'>");
            html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
            html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
            html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");
            html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin:20px 0; box-shadow:0 4px 12px rgba(0,0,0,0.1);">');
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="inline-link" target="_blank" rel="noopener noreferrer">$1</a>');
            html = html.replace(/\[\[(.*?)\]\]/g, '<a href="#" class="wiki-link" data-concept="$1" title="Concept Node: $1">[[ $1 ]]</a>');
            html = html.replace(/\[ \]/g, '<input type="checkbox" disabled style="margin-right:8px;">');
            html = html.replace(/\[x\]/gi, '<input type="checkbox" checked disabled style="margin-right:8px;">');
            html = html.replace(/___DROPCAP_([\s\S]*?)___/g, '<span class="drop-cap">$1</span>');

            const rawBlocks = html.split(NL + NL);
            const formattedBlocks = rawBlocks.map((block) => {
                block = block.trim();
                if (!block) return "";
                if (/^<(h[2-6]|blockquote|pre|hr|img)/i.test(block)) return block;

                if (block.startsWith("|")) {
                    const rows = block.split(NL).filter(line => line.trim().startsWith("|"));
                    let tableHTML = "<table style='width:100%; border-collapse:collapse; margin:20px 0; font-size:0.95em;'>";
                    rows.forEach((row, idx) => {
                        if (row.match(/^\|[\s-:|]+\|$/)) return;
                        const cells = row.split("|").slice(1, -1).map(c => c.trim());
                        tableHTML += "<tr>";
                        cells.forEach(cell => {
                            const tag = idx === 0 ? "th" : "td";
                            const style = idx === 0 ? "border-bottom:2px solid var(--line-strong); padding:12px 8px; text-align:left; font-weight:600;" : "border-bottom:1px solid var(--line); padding:12px 8px;";
                            tableHTML += `<${tag} style="${style}">${cell}</${tag}>`;
                        });
                        tableHTML += "</tr>";
                    });
                    tableHTML += "</table>";
                    return tableHTML;
                }

                if (block.startsWith("- ") || block.startsWith("* ")) {
                    const items = block.split(NL).map(line => line.replace(/^[-*]\s+/, "")).filter(Boolean);
                    return "<ul>" + items.map(it => "<li>" + it + "</li>").join("") + "</ul>";
                }

                if (/^\d+\.\s+/.test(block)) {
                    const items = block.split(NL).map(line => line.replace(/^\d+\.\s+/, "")).filter(Boolean);
                    return "<ol>" + items.map(it => "<li>" + it + "</li>").join("") + "</ol>";
                }

                return "<p>" + block.split(NL).join("<br>") + "</p>";
            });

            return formattedBlocks.join(NL + NL);
        }

        function escapeHtml(str) {
            return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        function updateLivePreview() {
            const title = titleInput.value.trim() || "Untitled Article";
            const subtitle = subtitleInput.value.trim() || "A philosophical inquiry into the depths of truth and narrative.";
            const category = categoryInput.value || "ontology";
            const author = authorInput.value.trim() || "Zachary Zhang";
            const body = bodyInput.value;

            const catLabels = {
                ontology: "Epistemology · Relational Ontology",
                narrative: "Culture & Narrative Ethics",
                reflections: "Life Reflections & Evowth",
                systems: "Systems Architecture & OntoMath",
                robotics: "Robotics & Spatial AI"
            };

            const cleanText = body.replace(/<[^>]*>/g, " ").trim();
            const words = cleanText ? cleanText.split(/\s+/).length : 0;
            const readMinutes = Math.max(1, Math.ceil(words / 190));
            const readTimeStr = `${readMinutes} min read`;

            prevTitle.textContent = title;
            prevSubtitle.textContent = subtitle;
            prevTag.textContent = catLabels[category] || "Inquiry";
            prevTag.setAttribute("data-category", category);
            prevAuthor.textContent = author;
            prevMetaTime.textContent = `Today · ${readTimeStr}`;
            prevProseBody.innerHTML = parseMarkdown(body);

            if (wordCountEl) wordCountEl.textContent = `${words.toLocaleString()} words`;
            if (readTimeEl) readTimeEl.textContent = readTimeStr;

            // Sync Syntax Highlighting Overlay
            const syntaxLayer = document.getElementById("syntax-layer");
            if (syntaxLayer) {
                let syntaxHtml = escapeHtml(body);
                // Headings
                syntaxHtml = syntaxHtml.replace(/^(#{1,6})(.*)$/gm, '<span class="md-h1">$1$2</span>');
                // Bold and Italic
                syntaxHtml = syntaxHtml.replace(/\*\*([^*]+)\*\*/g, '<span class="md-bold">**$1**</span>');
                syntaxHtml = syntaxHtml.replace(/\*([^*]+)\*/g, '<span class="md-italic">*$1*</span>');
                // Links
                syntaxHtml = syntaxHtml.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="md-link">[$1]($2)</span>');
                // Wiki Links
                syntaxHtml = syntaxHtml.replace(/\[\[(.*?)\]\]/g, '<span style="color:var(--muted);">[[</span><span style="color:var(--gold); text-decoration:underline;">$1</span><span style="color:var(--muted);">]]</span>');
                // Images
                syntaxHtml = syntaxHtml.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<span class="md-link">![$1]($2)</span>');
                // Blockquotes
                syntaxHtml = syntaxHtml.replace(/^(>.*)$/gm, '<span class="md-quote">$1</span>');
                // Code
                syntaxHtml = syntaxHtml.replace(/(`[^`]+`)/g, '<span class="md-code">$1</span>');
                syntaxHtml = syntaxHtml.replace(/(```[\s\S]*?```)/g, '<span class="md-code">$1</span>');
                // Bullets
                syntaxHtml = syntaxHtml.replace(/^([ \t]*[-*] )(.*)$/gm, '<span class="md-bullet">$1</span>$2');

                // Append a <br> if the text ends with a newline so the cursor has space
                if (body.endsWith('\n')) syntaxHtml += '<br>';
                syntaxLayer.innerHTML = syntaxHtml;
            }
        }

        if (bodyInput) {
            bodyInput.addEventListener("scroll", () => {
                const syntaxLayer = document.getElementById("syntax-layer");
                if (syntaxLayer) syntaxLayer.scrollTop = bodyInput.scrollTop;
            });
        }

        let autoSaveTimer = null;
        function triggerAutoSave() {
            if (statusIndicatorDot) statusIndicatorDot.classList.add("unsaved");
            if (saveStatusText) saveStatusText.textContent = "Saving changes...";

            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                commitCurrentDraft();
                if (statusIndicatorDot) statusIndicatorDot.classList.remove("unsaved");
                const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                if (saveStatusText) saveStatusText.textContent = `Draft saved locally at ${timeStr}`;
            }, 400);
        }

        function commitCurrentDraft() {
            if (!currentDraft) return;
            const title = titleInput.value.trim() || "Untitled Article";

            currentDraft.title = title;
            currentDraft.subtitle = subtitleInput.value.trim();
            currentDraft.category = categoryInput.value;
            currentDraft.slug = slugInput.value.trim() || slugify(title);
            currentDraft.author = authorInput.value.trim() || "Zachary Zhang";
            currentDraft.excerpt = excerptInput.value.trim();
            currentDraft.tags = tagsInput.value.trim();
            currentDraft.content = bodyInput.value;
            currentDraft.updatedAt = Date.now();

            const concepts = [];
            const regex = /\[\[(.*?)\]\]/g;
            let match;
            while ((match = regex.exec(currentDraft.content)) !== null) {
                const c = match[1].trim();
                if (c && !concepts.includes(c)) {
                    concepts.push(c);
                }
            }
            currentDraft.concepts = concepts;

            const words = currentDraft.content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
            currentDraft.readTime = `${Math.max(1, Math.ceil(words / 190))} min read`;

            const idx = drafts.findIndex(d => d.id === currentDraft.id);
            if (idx !== -1) drafts[idx] = currentDraft;
            else drafts.unshift(currentDraft);

            saveDrafts(drafts);
            renderDraftsList();
        }

        document.querySelectorAll(".tool-btn[data-action]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const action = btn.getAttribute("data-action");
                insertFormatting(action);
            });
        });

        function insertFormatting(action) {
            const NL = String.fromCharCode(10);
            const start = bodyInput.selectionStart;
            const end = bodyInput.selectionEnd;
            const text = bodyInput.value;
            const selected = text.slice(start, end);
            let replacement = "";
            let cursorOffset = 0;

            switch (action) {
                case "bold":
                    replacement = "**" + (selected || "bold text") + "**";
                    cursorOffset = selected ? replacement.length : 2;
                    break;
                case "italic":
                    replacement = "*" + (selected || "italic text") + "*";
                    cursorOffset = selected ? replacement.length : 1;
                    break;
                case "strike":
                    replacement = "~~" + (selected || "strikethrough") + "~~";
                    cursorOffset = selected ? replacement.length : 2;
                    break;
                case "h2":
                    replacement = NL + NL + "## " + (selected || "Section Heading") + NL + NL;
                    cursorOffset = replacement.length;
                    break;
                case "h3":
                    replacement = NL + NL + "### " + (selected || "Sub-Heading") + NL + NL;
                    cursorOffset = replacement.length;
                    break;
                case "h4":
                    replacement = NL + NL + "#### " + (selected || "Minor Topic") + NL + NL;
                    cursorOffset = replacement.length;
                    break;
                case "quote":
                    replacement = NL + NL + "> “" + (selected || "Insert illuminated quote or epigraph here.") + "”" + NL + NL;
                    cursorOffset = replacement.length;
                    break;
                case "dropcap":
                    const firstChar = selected ? selected.charAt(0) : "W";
                    const rest = selected ? selected.slice(1) : "ords of the thought...";
                    replacement = '<span class="drop-cap">' + firstChar + '</span>' + rest;
                    cursorOffset = replacement.length;
                    break;
                case "ul":
                    replacement = NL + "- " + (selected || "First item") + NL + "- Second item" + NL + "- Third item" + NL;
                    cursorOffset = replacement.length;
                    break;
                case "ol":
                    replacement = NL + "1. " + (selected || "First step") + NL + "2. Second step" + NL + "3. Third step" + NL;
                    cursorOffset = replacement.length;
                    break;
                case "code":
                    replacement = NL + NL + "```cpp" + NL + (selected || "// Code or mathematical formalization" + NL + "void integrate_ontology();") + NL + "```" + NL + NL;
                    cursorOffset = replacement.length;
                    break;
                case "link":
                    replacement = "[" + (selected || "Link title") + "](https://example.com)";
                    cursorOffset = replacement.length;
                    break;
                case "hr":
                    replacement = NL + NL + "---" + NL + NL;
                    cursorOffset = replacement.length;
                    break;
            }

            bodyInput.value = text.slice(0, start) + replacement + text.slice(end);
            bodyInput.focus();
            bodyInput.setSelectionRange(start + cursorOffset, start + cursorOffset);
            updateLivePreview();
            triggerAutoSave();
        }

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                if (confirm("Clear all text from this draft?")) {
                    bodyInput.value = "";
                    titleInput.value = "";
                    subtitleInput.value = "";
                    excerptInput.value = "";
                    updateLivePreview();
                    triggerAutoSave();
                }
            });
        }

        if (bodyInput) {
            bodyInput.addEventListener("keydown", (e) => {
                if (e.metaKey || e.ctrlKey) {
                    if (e.key === "b") {
                        e.preventDefault();
                        insertFormatting("bold");
                    } else if (e.key === "i") {
                        e.preventDefault();
                        insertFormatting("italic");
                    } else if (e.key === "k") {
                        e.preventDefault();
                        insertFormatting("link");
                    } else if (e.key === "e") {
                        e.preventDefault();
                        insertFormatting("code");
                    }
                }
                if (e.key === "Escape" && document.body.classList.contains("zen-mode")) {
                    document.body.classList.remove("zen-mode");
                    const zenBtn = document.getElementById("zen-mode-btn");
                    if (zenBtn) {
                        zenBtn.textContent = "Zen";
                        zenBtn.classList.remove("active");
                    }
                }
            });
        }

        function setViewMode(mode) {
            document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
            const targetBtn = document.querySelector(`.view-btn[data-view="${mode}"]`);
            if (targetBtn) targetBtn.classList.add("active");

            splitLayout.classList.remove("view-editor", "view-preview");
            if (mode === "editor") splitLayout.classList.add("view-editor");
            else if (mode === "preview") splitLayout.classList.add("view-preview");

            localStorage.setItem("dimension_studio_view", mode);
        }

        if (viewSplitBtn) viewSplitBtn.addEventListener("click", () => setViewMode("split"));
        if (viewEditorBtn) viewEditorBtn.addEventListener("click", () => setViewMode("editor"));
        if (viewPreviewBtn) viewPreviewBtn.addEventListener("click", () => setViewMode("preview"));

        const savedView = localStorage.getItem("dimension_studio_view") || "split";
        setViewMode(savedView);

        const zenBtn = document.getElementById("zen-mode-btn");
        if (zenBtn) {
            zenBtn.addEventListener("click", () => {
                document.body.classList.toggle("zen-mode");
                const isZen = document.body.classList.contains("zen-mode");
                zenBtn.textContent = isZen ? "Exit Zen" : "Zen";
                zenBtn.classList.toggle("active", isZen);
            });
        }

        function openDrawer() {
            if (draftsDrawer) {
                draftsDrawer.removeAttribute("hidden");
                draftsBackdrop.removeAttribute("hidden");
                renderDraftsList();
            }
        }
        function closeDrawer() {
            if (draftsDrawer) {
                draftsDrawer.setAttribute("hidden", "");
                draftsBackdrop.setAttribute("hidden", "");
            }
        }

        if (openDraftsBtn) openDraftsBtn.addEventListener("click", openDrawer);
        if (closeDraftsBtn) closeDraftsBtn.addEventListener("click", closeDrawer);
        if (draftsBackdrop) draftsBackdrop.addEventListener("click", closeDrawer);

        function renderDraftsList() {
            if (!draftsListContainer) return;
            drafts = getDrafts();
            draftsListContainer.innerHTML = "";

            if (drafts.length === 0) {
                draftsListContainer.innerHTML = "<p style='color:var(--muted);font-size:0.9rem;'>No drafts saved yet.</p>";
                return;
            }

            drafts.forEach((d) => {
                const isActive = d.id === currentDraft.id;
                const card = document.createElement("div");
                card.className = `draft-item-card ${isActive ? "active" : ""}`;

                const updatedTime = new Date(d.updatedAt || Date.now()).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                });

                card.innerHTML = `
                    <div class="draft-title-row">
                        <span class="draft-card-title">${d.title || "Untitled Draft"}</span>
                        ${d.isPublished ? '<span class="badge" style="background:var(--teal);color:#07080d;font-weight:700;">Published</span>' : '<span class="badge">Draft</span>'}
                    </div>
                    <div class="draft-meta-row">
                        <span>${d.category || "ontology"}</span>
                        <span>${updatedTime}</span>
                    </div>
                    <div class="draft-actions-row">
                        <button type="button" class="btn btn-secondary btn-small load-draft-btn" style="flex:1;">Open</button>
                        <button type="button" class="btn btn-secondary btn-small dup-draft-btn" title="Duplicate">📑</button>
                        <button type="button" class="btn btn-secondary btn-small del-draft-btn" title="Delete" style="color:#ef4444;">🗑</button>
                    </div>
                `;

                card.querySelector(".load-draft-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    loadDraftIntoEditor(d);
                    closeDrawer();
                    showToast(`Opened: ${d.title || "Untitled"}`);
                });

                card.querySelector(".dup-draft-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    const clone = {
                        ...d,
                        id: "draft_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                        title: (d.title || "Draft") + " (Copy)",
                        slug: (d.slug || "draft") + "-copy",
                        updatedAt: Date.now(),
                        isPublished: false
                    };
                    drafts.unshift(clone);
                    saveDrafts(drafts);
                    renderDraftsList();
                    showToast("Draft duplicated!");
                });

                card.querySelector(".del-draft-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (drafts.length <= 1) {
                        alert("You must have at least one draft.");
                        return;
                    }
                    if (confirm(`Delete "${d.title || "Untitled"}"?`)) {
                        drafts = drafts.filter(x => x.id !== d.id);
                        saveDrafts(drafts);
                        if (currentDraft.id === d.id) {
                            loadDraftIntoEditor(drafts[0]);
                        } else {
                            renderDraftsList();
                        }
                        showToast("Draft deleted.");
                    }
                });

                draftsListContainer.appendChild(card);
            });
        }

        if (createNewDraftBtn) {
            createNewDraftBtn.addEventListener("click", () => {
                commitCurrentDraft();
                const newD = createDraftObject("New Inquiry", "Articulating a fresh perspective...");
                drafts.unshift(newD);
                saveDrafts(drafts);
                loadDraftIntoEditor(newD);
                closeDrawer();
                showToast("Created new blank article.");
            });
        }

        function openTemplates() {
            if (templatesModal) templatesModal.removeAttribute("hidden");
        }
        function closeTemplates() {
            if (templatesModal) templatesModal.setAttribute("hidden", "");
        }

        if (openTemplatesBtn) openTemplatesBtn.addEventListener("click", openTemplates);
        if (closeTemplatesBtn) closeTemplatesBtn.addEventListener("click", closeTemplates);
        if (templatesModal) {
            templatesModal.addEventListener("click", (e) => {
                if (e.target === templatesModal) closeTemplates();
            });
        }

        document.querySelectorAll(".btn-use-template").forEach((btn) => {
            btn.addEventListener("click", () => {
                const key = btn.getAttribute("data-template");
                const tpl = TEMPLATES[key];
                if (tpl) {
                    if (bodyInput.value.trim() && !confirm("Replace current editor contents with template?")) {
                        return;
                    }
                    titleInput.value = tpl.title;
                    subtitleInput.value = tpl.subtitle;
                    categoryInput.value = tpl.category;
                    slugInput.value = tpl.slug;
                    excerptInput.value = tpl.excerpt;
                    tagsInput.value = tpl.tags;
                    bodyInput.value = tpl.body;
                    updateLivePreview();
                    commitCurrentDraft();
                    closeTemplates();
                    showToast(`Template applied: ${tpl.title}`);
                }
            });
        });

        if (exportMenuBtn) {
            exportMenuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (exportDropdown) exportDropdown.toggleAttribute("hidden");
            });
            window.addEventListener("click", () => {
                if (exportDropdown) exportDropdown.setAttribute("hidden", "");
            });
        }

        function generateStandalonePostHtml(draft) {
            const compiledBody = parseMarkdown(draft.content || "");
            const catLabels = {
                ontology: "Epistemology · Relational Ontology",
                narrative: "Culture & Narrative Ethics",
                reflections: "Life Reflections & Evowth",
                systems: "Systems Architecture & OntoMath",
                robotics: "Robotics & Spatial AI"
            };
            const catLabel = catLabels[draft.category] || "Inquiry";
            const dateStr = draft.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const readTime = draft.readTime || "6 min read";

            return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(draft.title)} — Dimension of Thought</title>
    <meta name="description" content="${escapeHtml(draft.subtitle || draft.excerpt || "")}">
    <meta name="author" content="${escapeHtml(draft.author || "Zachary Zhang")}">
    <link rel="canonical" href="https://zhangzachary834-commits.github.io/posts/${draft.slug}.html">

    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(draft.title)} — Dimension of Thought">
    <meta property="og:description" content="${escapeHtml(draft.subtitle || "")}">
    <meta property="og:image" content="../assets/dimension-emblem.jpg">

    <link rel="icon" type="image/jpeg" href="../assets/favicon.jpg">
    <link rel="stylesheet" href="../style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div id="scroll-progress" class="scroll-progress-bar" aria-hidden="true"></div>

    <header class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-left-brand">
                <div class="mode-switcher-pill" role="tablist" aria-label="Site View Mode Switcher">
                    <a href="../index.html?mode=personal" class="mode-btn" title="Switch to Zachary Zhang's Personal Portfolio">
                        <span class="mode-btn-icon">👤</span>
                        <span class="mode-btn-text">Zachary Zhang</span>
                    </a>
                    <a href="../index.html?mode=dimension" class="mode-btn active" title="Switch to Dimension of Thought Platform">
                        <span class="mode-btn-icon">✧</span>
                        <span class="mode-btn-text">Dimension of Thought</span>
                    </a>
                </div>
            </div>

            <nav class="nav-menu" id="nav-menu" aria-label="Primary">
                <ul class="nav-links">
                    <li><a href="../index.html?mode=dimension" class="nav-link">Home</a></li>
                    <li><a href="../story.html" class="nav-link">Story</a></li>
                    <li><a href="../manifesto.html" class="nav-link">Manifesto</a></li>
                    <li><a href="../library.html" class="nav-link active">The Library</a></li>
                    <li><a href="../ecosystem.html" class="nav-link">Ecosystem</a></li>
                    <li><a href="../contact.html" class="nav-link">Dialogue</a></li>
                </ul>
            </nav>

            <div class="nav-actions">
                <button id="theme-toggle-btn" class="icon-btn" title="Toggle theme" aria-label="Toggle dark or light mode">
                    <span id="theme-icon" aria-hidden="true">☽</span>
                </button>
            </div>
        </div>
    </header>

    <main id="main-content">
        <header class="page-hero">
            <div class="container" style="max-width: 860px;">
                <div class="page-breadcrumb">
                    <a href="../index.html?mode=dimension">Dimension of Thought</a>
                    <span class="page-breadcrumb-sep">/</span>
                    <a href="../library.html">The Library</a>
                    <span class="page-breadcrumb-sep">/</span>
                    <span>Essay</span>
                </div>
                <div class="essay-meta" style="margin-bottom: 12px;">
                    <span class="essay-tag" data-category="${draft.category}">${catLabel}</span>
                    <span class="essay-read-time">${dateStr} · ${readTime}</span>
                </div>
                <h1 class="page-title" style="font-size: clamp(2.4rem, 4.8vw, 3.8rem);">${escapeHtml(draft.title)}</h1>
                <p class="page-subtitle">${escapeHtml(draft.subtitle || "")}</p>
                <div class="essay-author-bar" style="margin-top: 20px;">
                    <span>Written by <strong>${escapeHtml(draft.author || "Zachary Zhang")}</strong></span>
                    <span class="essay-dot">•</span>
                    <span>Dimension of Thought Archives</span>
                </div>
            </div>
        </header>

        <article class="section" style="padding-top: 48px;">
            <div class="container" style="max-width: 860px;">
                <div class="essay-prose">
${compiledBody}

                    <hr class="essay-divider">

                    <div style="background: var(--bg-card); padding: 30px; border-radius: var(--radius-md); border: 1px solid var(--line); margin-top: 40px;">
                        <h4 style="margin-top: 0; color: var(--gold);">Reflections on the Essay</h4>
                        <p style="font-size: 0.98rem; margin-bottom: 18px;">
                            Have thoughts on this inquiry? Connect with Zachary Zhang or join the Dimension of Thought living dialogue.
                        </p>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <a href="../contact.html" class="btn btn-primary btn-small">Discuss with Zach →</a>
                            <a href="../library.html" class="btn btn-secondary btn-small">Back to All Essays</a>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="container footer-container">
            <div class="footer-left">
                <div class="footer-brand-row">
                    <img src="../assets/favicon.jpg" alt="Dimension of Thought Emblem" class="footer-emblem" width="28" height="28">
                    <p class="footer-copy">&copy; 2026 Zachary Zhang · Dimension of Thought</p>
                </div>
                <p class="footer-tagline">Systems, Ontology, and the Constellation of Life &amp; Community.</p>
            </div>
            <nav class="footer-links" aria-label="Footer Navigation">
                <a href="../index.html?mode=personal">Portfolio</a>
                <a href="../index.html?mode=dimension">Dimension of Thought</a>
                <a href="../library.html">The Library</a>
                <a href="https://github.com/zhangzachary834-commits" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/zachary-of-zhang/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </nav>
        </div>
    </footer>

    <script src="../script.js"></script>
</body>
</html>`;
        }

        if (exportHtmlBtn) {
            exportHtmlBtn.addEventListener("click", () => {
                commitCurrentDraft();
                const htmlContent = generateStandalonePostHtml(currentDraft);
                const blob = new Blob([htmlContent], { type: "text/html" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${currentDraft.slug || "essay"}.html`;
                link.click();
                URL.revokeObjectURL(link.href);
                showToast(`Downloaded ${currentDraft.slug}.html`);
            });
        }

        if (exportMdBtn) {
            exportMdBtn.addEventListener("click", () => {
                commitCurrentDraft();
                const mdContent = `---
title: "${currentDraft.title}"
subtitle: "${currentDraft.subtitle}"
category: "${currentDraft.category}"
author: "${currentDraft.author}"
date: "${currentDraft.date}"
tags: "${currentDraft.tags}"
---

${currentDraft.content}`;
                const blob = new Blob([mdContent], { type: "text/markdown" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${currentDraft.slug || "essay"}.md`;
                link.click();
                URL.revokeObjectURL(link.href);
                showToast(`Downloaded ${currentDraft.slug}.md`);
            });
        }

        if (copyHtmlBodyBtn) {
            copyHtmlBodyBtn.addEventListener("click", async () => {
                commitCurrentDraft();
                const bodyHtml = parseMarkdown(currentDraft.content);
                try {
                    await navigator.clipboard.writeText(bodyHtml);
                    showToast("Copied formatted HTML body to clipboard!");
                } catch (e) {
                    showToast("Failed to copy HTML");
                }
            });
        }

        if (publishBtn) {
            publishBtn.addEventListener("click", async () => {
                commitCurrentDraft();
                if (!currentDraft.title || !currentDraft.content) {
                    alert("Please provide at least a title and body text before publishing.");
                    return;
                }

                currentDraft.isPublished = true;
                currentDraft.updatedAt = Date.now();

                let published = [];
                try {
                    published = JSON.parse(localStorage.getItem("dimension_custom_articles") || "[]");
                } catch (e) {
                    published = [];
                }

                const existingIdx = published.findIndex(p => p.id === currentDraft.id);
                if (existingIdx !== -1) {
                    published[existingIdx] = currentDraft;
                } else {
                    published.unshift(currentDraft);
                }

                localStorage.setItem("dimension_custom_articles", JSON.stringify(published));
                saveDrafts(drafts);
                renderDraftsList();

                const htmlContent = generateStandalonePostHtml(currentDraft);
                const defaultName = (currentDraft.slug || "article") + ".html";

                try {
                    if (window.showSaveFilePicker) {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: defaultName,
                            types: [{
                                description: "HTML Document",
                                accept: { "text/html": [".html"] },
                            }],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(htmlContent);
                        await writable.close();
                        showToast(`Successfully published to ${handle.name}!`);
                    } else {
                        const blob = new Blob([htmlContent], { type: "text/html" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = defaultName;
                        link.click();
                        showToast("Published file downloaded.");
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error("Save failed:", err);
                        showToast("Failed to save file.");
                    }
                }
            });
        }

        [titleInput, subtitleInput, categoryInput, slugInput, authorInput, excerptInput, tagsInput, bodyInput].forEach((el) => {
            if (el) {
                el.addEventListener("input", () => {
                    if (el === titleInput && !slugInput.dataset.manual) {
                        slugInput.value = slugify(titleInput.value);
                    }
                    updateLivePreview();
                    triggerAutoSave();
                });
            }
        });

        if (slugInput) {
            slugInput.addEventListener("input", () => {
                slugInput.dataset.manual = "true";
            });
        }

        window.addEventListener("keydown", (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
            const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

            if (ctrlOrCmd && e.key.toLowerCase() === "s") {
                e.preventDefault();
                commitCurrentDraft();
                showToast("Draft saved.");
            } else if (ctrlOrCmd && e.key.toLowerCase() === "b" && document.activeElement === bodyInput) {
                e.preventDefault();
                insertFormatting("bold");
            } else if (ctrlOrCmd && e.key.toLowerCase() === "i" && document.activeElement === bodyInput) {
                e.preventDefault();
                insertFormatting("italic");
            }
        });

        loadDraftIntoEditor(currentDraft);
    }
    initStudioEngine();

// =========================================================================
    // Enhanced Library Celestial Constellation Mode & Interactive Graph Engine
    // =========================================================================
    function initLibraryConstellation() {
        const toggleBtn = document.getElementById("toggle-graph-view-btn");
        const graphContainer = document.getElementById("graph-view-container");
        const gridContainer = document.getElementById("essays-grid");
        const canvas = document.getElementById("library-graph-canvas");
        const tooltip = document.getElementById("graph-tooltip");
        const inspectorCard = document.getElementById("constellation-inspector-card");

        if (!toggleBtn || !graphContainer || !gridContainer || !canvas) return;

        const ctx = canvas.getContext("2d");
        let isGraphView = false;
        let animationId = null;
        let nodes = [];
        let edges = [];
        let photonParticles = [];
        let bgMicroStars = [];
        let nebulae = [];
        let hoveredNode = null;
        let selectedNode = null;
        let isolatedNode = null;
        let activeCluster = "all";
        let layoutMode = "galaxy"; // 'galaxy', 'orbital', 'lattice'
        let searchQuery = "";
        let enableParticles = true;
        let enableNebulae = true;

        // Camera Pan & Zoom Transform
        const camera = {
            x: 0,
            y: 0,
            zoom: 1.0,
            targetZoom: 1.0,
            targetX: 0,
            targetY: 0
        };

        // Category Palette
        const colorMap = {
            ontology: "#c084fc",
            narrative: "#f87171",
            reflections: "#4ade80",
            systems: "#38bdf8",
            robotics: "#facc15",
            concept: "#e2e8f0"
        };

        const catNames = {
            ontology: "Epistemology · Relational Ontology",
            narrative: "Culture & Narrative Ethics",
            reflections: "Life Reflections & Evowth",
            systems: "Systems Architecture & OntoMath",
            robotics: "Robotics & Spatial AI",
            concept: "Ontological Concept"
        };

        function resizeCanvas() {
            const rect = graphContainer.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function initBackgroundElements() {
            const rect = graphContainer.getBoundingClientRect();
            const w = rect.width || 800;
            const h = rect.height || 700;

            bgMicroStars = [];
            for (let i = 0; i < 80; i++) {
                bgMicroStars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.2 + 0.4,
                    twinkleSpeed: Math.random() * 0.02 + 0.008,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: i % 3 === 0 ? "#d8b46e" : (i % 3 === 1 ? "#6ee7d8" : "#c084fc")
                });
            }

            nebulae = [
                { x: w * 0.25, y: h * 0.35, r: 180, color: "rgba(192, 132, 252, 0.08)", vx: 0.04, vy: 0.02 },
                { x: w * 0.75, y: h * 0.35, r: 190, color: "rgba(248, 113, 113, 0.08)", vx: -0.03, vy: 0.02 },
                { x: w * 0.35, y: h * 0.75, r: 170, color: "rgba(74, 222, 128, 0.07)", vx: 0.02, vy: -0.03 },
                { x: w * 0.70, y: h * 0.70, r: 180, color: "rgba(56, 189, 248, 0.08)", vx: -0.02, vy: -0.02 }
            ];
        }

        function initGraphData() {
            nodes = [];
            edges = [];
            photonParticles = [];

            const categoryHubs = {};
            const conceptHubs = {};
            const cards = document.querySelectorAll(".essay-card");

            const rect = graphContainer.getBoundingClientRect();
            const width = rect.width || 800;
            const height = rect.height || 700;
            const center = { x: width / 2, y: height / 2 };

            // 1. Create Article Nodes
            cards.forEach((card, idx) => {
                const titleEl = card.querySelector(".essay-title a");
                if (!titleEl) return;
                const title = titleEl.textContent.trim();
                const url = titleEl.getAttribute("href");
                const category = card.getAttribute("data-category") || "ontology";
                const subtitle = (card.querySelector(".essay-subtitle") || {}).textContent || "";
                const excerpt = (card.querySelector(".essay-excerpt") || {}).textContent || "";
                const readTime = (card.querySelector(".essay-read-time") || {}).textContent || "6 min read";
                const author = (card.querySelector(".essay-author") || {}).textContent || "By Zachary Zhang";

                // Extract concepts
                let concepts = [];
                const conceptsAttr = card.getAttribute("data-concepts");
                if (conceptsAttr) {
                    concepts = conceptsAttr.split(",").map(c => c.trim()).filter(c => c);
                }

                // Compute initial angle distribution around center
                const angle = (idx / Math.max(1, cards.length)) * Math.PI * 2;
                const dist = 190 + (idx % 2) * 50;

                const node = {
                    id: "art_" + title,
                    isHub: false,
                    isConcept: false,
                    title: title,
                    subtitle: subtitle,
                    excerpt: excerpt,
                    readTime: readTime,
                    author: author,
                    url: url,
                    category: category,
                    concepts: concepts,
                    color: colorMap[category] || "#6ee7d8",
                    radius: 8.5,
                    x: center.x + Math.cos(angle) * dist,
                    y: center.y + Math.sin(angle) * dist,
                    targetX: center.x + Math.cos(angle) * dist,
                    targetY: center.y + Math.sin(angle) * dist,
                    vx: 0,
                    vy: 0,
                    orbitAngle: angle,
                    orbitRadius: dist,
                    orbitSpeed: 0.002 * ((idx % 2 === 0) ? 1 : -1),
                    orbitOffset: Math.random() * Math.PI * 2,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    pulsePhase: Math.random() * Math.PI * 2
                };
                nodes.push(node);

                // Create category hub if not exists
                if (!categoryHubs[category]) {
                    const catCount = Object.keys(categoryHubs).length;
                    const hubAngle = (catCount / 4) * Math.PI * 2 - Math.PI / 4;
                    const hubDist = 110;

                    const hub = {
                        id: "hub_" + category,
                        isHub: true,
                        isConcept: false,
                        title: category.charAt(0).toUpperCase() + category.slice(1) + " Hub",
                        subtitle: catNames[category] || "Core Discipline",
                        excerpt: `Core thematic cluster for ${category} inquiries across the holistic narrative continuum.`,
                        url: null,
                        category: category,
                        concepts: [],
                        color: colorMap[category] || "#d8b46e",
                        radius: 14,
                        x: center.x + Math.cos(hubAngle) * hubDist,
                        y: center.y + Math.sin(hubAngle) * hubDist,
                        targetX: center.x + Math.cos(hubAngle) * hubDist,
                        targetY: center.y + Math.sin(hubAngle) * hubDist,
                        vx: 0,
                        vy: 0,
                        orbitAngle: hubAngle,
                        orbitRadius: hubDist,
                        orbitSpeed: 0.001,
                        orbitOffset: Math.random() * Math.PI * 2,
                        twinkleOffset: Math.random() * Math.PI * 2,
                        pulsePhase: 0
                    };
                    categoryHubs[category] = hub;
                    nodes.push(hub);
                }

                // Edge from article to its category hub
                edges.push({
                    source: node,
                    target: categoryHubs[category],
                    isConceptEdge: false,
                    color: colorMap[category] || "#d8b46e"
                });

                // 2. Create concept diamond stars and relational edges
                concepts.forEach((concept, cIdx) => {
                    if (!conceptHubs[concept]) {
                        const conceptAngle = Math.random() * Math.PI * 2;
                        const conceptDist = 270 + Math.random() * 60;
                        const conceptNode = {
                            id: "concept_" + concept,
                            isHub: false,
                            isConcept: true,
                            title: "[[" + concept + "]]",
                            subtitle: "Ontological Relational Concept",
                            excerpt: `Cross-disciplinary conceptual bridge connecting inquiries around ${concept}.`,
                            url: null,
                            category: "concept",
                            concepts: [],
                            color: "#e2e8f0",
                            radius: 6.5,
                            x: center.x + Math.cos(conceptAngle) * conceptDist,
                            y: center.y + Math.sin(conceptAngle) * conceptDist,
                            targetX: center.x + Math.cos(conceptAngle) * conceptDist,
                            targetY: center.y + Math.sin(conceptAngle) * conceptDist,
                            vx: 0,
                            vy: 0,
                            orbitAngle: conceptAngle,
                            orbitRadius: conceptDist,
                            orbitSpeed: 0.0015,
                            orbitOffset: Math.random() * Math.PI * 2,
                            twinkleOffset: Math.random() * Math.PI * 2,
                            pulsePhase: Math.random() * Math.PI * 2
                        };
                        conceptHubs[concept] = conceptNode;
                        nodes.push(conceptNode);
                    }

                    edges.push({
                        source: node,
                        target: conceptHubs[concept],
                        isConceptEdge: true,
                        color: "#94a3b8"
                    });
                });
            });

            // 3. Initialize Photon Pulse Packets along edges
            for (let i = 0; i < edges.length * 2; i++) {
                const edge = edges[i % edges.length];
                photonParticles.push({
                    edge: edge,
                    progress: Math.random(),
                    speed: 0.003 + Math.random() * 0.004,
                    forward: Math.random() > 0.3,
                    size: Math.random() * 2 + 1.5,
                    color: edge.isConceptEdge ? "#38bdf8" : edge.color
                });
            }

            // Update stats readout
            const essayCount = cards.length;
            const hubCount = Object.keys(categoryHubs).length;
            const conceptCount = Object.keys(conceptHubs).length;
            const synapseCount = edges.length;

            const elE = document.getElementById("c-stat-essays");
            const elH = document.getElementById("c-stat-hubs");
            const elC = document.getElementById("c-stat-concepts");
            const elS = document.getElementById("c-stat-synapses");
            if (elE) elE.textContent = essayCount;
            if (elH) elH.textContent = hubCount;
            if (elC) elC.textContent = conceptCount;
            if (elS) elS.textContent = synapseCount;

            initBackgroundElements();
        }

        // Draw diamond shape for concepts
        function drawDiamond(ctx, x, y, size) {
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x - size, y);
            ctx.closePath();
        }

        function draw() {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);

            ctx.clearRect(0, 0, width, height);

            // Apply camera pan & zoom
            ctx.save();
            ctx.translate(width / 2 + camera.x, height / 2 + camera.y);
            ctx.scale(camera.zoom, camera.zoom);
            ctx.translate(-width / 2, -height / 2);

            const time = Date.now() * 0.001;

            // 1. Render Cosmic Nebulae
            if (enableNebulae) {
                nebulae.forEach(n => {
                    n.x += n.vx;
                    n.y += n.vy;
                    if (n.x < 50 || n.x > width - 50) n.vx *= -1;
                    if (n.y < 50 || n.y > height - 50) n.vy *= -1;

                    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
                    grad.addColorStop(0, n.color);
                    grad.addColorStop(1, "transparent");
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, width, height);
                });
            }

            // 2. Render Twinkling Background Micro-Stars
            bgMicroStars.forEach(s => {
                const twinkle = Math.sin(time * s.twinkleSpeed * 50 + s.twinkleOffset) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(247, 243, 235, ${0.1 + twinkle * 0.4})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
                ctx.fill();
            });

            // 3. Render Synapse Edges
            edges.forEach(edge => {
                const a = edge.source;
                const b = edge.target;

                // Determine visibility based on active filter & search
                const isFiltered = matchesActiveFilter(a) && matchesActiveFilter(b);
                const isSearched = matchesSearch(a) || matchesSearch(b);
                const isHighlighted = (hoveredNode && (a === hoveredNode || b === hoveredNode)) ||
                                      (selectedNode && (a === selectedNode || b === selectedNode));
                const isIsolated = isolatedNode ? (a === isolatedNode || b === isolatedNode) : true;

                if (!isFiltered || !isIsolated) return;

                const dist = Math.hypot(b.x - a.x, b.y - a.y);
                const organicFade = Math.sin(time * 2.5 + a.orbitOffset + b.orbitOffset) * 0.25 + 0.75;
                let alpha = Math.max(0.06, 1 - (dist / 480)) * organicFade;

                if (!isSearched && searchQuery) alpha *= 0.15;

                ctx.save();
                if (isHighlighted) {
                    alpha = 0.95;
                    ctx.lineWidth = 2.0;
                    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                    grad.addColorStop(0, a.color);
                    grad.addColorStop(1, b.color);
                    ctx.strokeStyle = grad;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = a.color;
                } else {
                    ctx.lineWidth = edge.isConceptEdge ? 0.9 : 1.2;
                    ctx.strokeStyle = edge.isConceptEdge
                        ? `rgba(148, 163, 184, ${alpha * 0.35})`
                        : `rgba(216, 180, 110, ${alpha * 0.45})`;
                }

                // Curved bezier synapse
                const cx = (a.x + b.x) / 2 + Math.sin(time * 1.5 + a.orbitOffset) * 25;
                const cy = (a.y + b.y) / 2 + Math.cos(time * 1.5 + b.orbitOffset) * 25;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.quadraticCurveTo(cx, cy, b.x, b.y);
                ctx.stroke();
                ctx.restore();

                // Save curve control point for particles
                edge.lastCx = cx;
                edge.lastCy = cy;
            });

            // 4. Render Photon Pulse Particles
            if (enableParticles) {
                photonParticles.forEach(p => {
                    const edge = p.edge;
                    if (!edge || !edge.lastCx) return;
                    const a = edge.source;
                    const b = edge.target;

                    if (!matchesActiveFilter(a) || !matchesActiveFilter(b)) return;
                    if (isolatedNode && a !== isolatedNode && b !== isolatedNode) return;

                    p.progress += p.speed;
                    if (p.progress >= 1.0) p.progress = 0;

                    const t = p.forward ? p.progress : 1 - p.progress;
                    // Quadratic Bezier Interpolation: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
                    const inv = 1 - t;
                    const px = inv * inv * a.x + 2 * inv * t * edge.lastCx + t * t * b.x;
                    const py = inv * inv * a.y + 2 * inv * t * edge.lastCy + t * t * b.y;

                    ctx.fillStyle = p.color;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = p.color;
                    ctx.beginPath();
                    ctx.arc(px, py, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                });
            }

            // 5. Render Constellation Nodes (Hubs, Articles, Concepts)
            nodes.forEach(node => {
                const isFiltered = matchesActiveFilter(node);
                const isSearched = matchesSearch(node);
                const isHovered = (node === hoveredNode);
                const isSelected = (node === selectedNode);
                const isIsolated = isolatedNode ? (node === isolatedNode || isNeighbor(node, isolatedNode)) : true;

                if (!isFiltered || !isIsolated) return;

                const blink = Math.sin(time * 3 + node.twinkleOffset) * 0.5 + 0.5;
                let currentRadius = node.isHub
                    ? node.radius + Math.sin(time * 2) * 1.5
                    : node.radius * (0.8 + blink * 0.3);

                if (isHovered || isSelected) currentRadius *= 1.3;

                ctx.save();

                // Target highlight ring if selected
                if (isSelected) {
                    const pulseRing = node.radius * 2.2 + Math.sin(time * 4) * 3;
                    ctx.strokeStyle = "rgba(216, 180, 110, 0.8)";
                    ctx.lineWidth = 1.8;
                    ctx.setLineDash([4, 3]);
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, pulseRing, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Glow halos
                if (node.isHub) {
                    ctx.shadowBlur = 18 + blink * 8;
                    ctx.shadowColor = node.color;
                } else if (isHovered || isSelected || isSearched) {
                    ctx.shadowBlur = 14;
                    ctx.shadowColor = node.color;
                }

                const alphaHex = (!isSearched && searchQuery) ? "44" : "ff";

                if (node.isConcept) {
                    // Draw diamond star for concepts
                    ctx.fillStyle = isHovered ? "#38bdf8" : (node.color + alphaHex);
                    ctx.strokeStyle = isHovered ? "#fff" : "rgba(226, 232, 240, 0.6)";
                    ctx.lineWidth = 1.5;
                    drawDiamond(ctx, node.x, node.y, currentRadius);
                    ctx.fill();
                    ctx.stroke();
                } else {
                    // Circular star for articles and category hubs
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
                    ctx.fillStyle = node.isHub ? node.color : (node.color + alphaHex);
                    ctx.fill();

                    if (node.isHub) {
                        ctx.strokeStyle = "#fff";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
                ctx.shadowBlur = 0;

                // Render Labels
                const showLabel = node.isHub || isHovered || isSelected || (camera.zoom > 1.25) || (isSearched && searchQuery);
                if (showLabel) {
                    ctx.fillStyle = isSelected
                        ? "#d8b46e"
                        : (node.isHub ? "rgba(247, 243, 235, 0.95)" : "rgba(247, 243, 235, 0.8)");
                    ctx.font = node.isHub
                        ? "600 13px 'IBM Plex Mono', monospace"
                        : (node.isConcept ? "500 11px 'IBM Plex Mono', monospace" : "500 12px 'Source Sans 3', sans-serif");
                    ctx.textAlign = "center";
                    ctx.fillText(node.title, node.x, node.y + currentRadius + 14);
                }

                ctx.restore();
            });

            ctx.restore(); // Restore camera transform
        }

        function isNeighbor(a, b) {
            if (a === b) return true;
            return edges.some(e => (e.source === a && e.target === b) || (e.source === b && e.target === a));
        }

        function matchesActiveFilter(node) {
            if (activeCluster === "all") return true;
            if (activeCluster === "concepts") return node.isConcept;
            return node.category === activeCluster;
        }

        function matchesSearch(node) {
            if (!searchQuery) return false;
            return node.title.toLowerCase().includes(searchQuery) ||
                   node.subtitle.toLowerCase().includes(searchQuery) ||
                   (node.concepts && node.concepts.some(c => c.toLowerCase().includes(searchQuery)));
        }

        // Layout Physics Simulation
        function simulate() {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            const center = { x: width / 2, y: height / 2 };

            if (layoutMode === "orbital") {
                // Orbital concentric rotations
                nodes.forEach(node => {
                    if (node === dragNode) return;
                    node.orbitAngle += node.orbitSpeed;
                    const tx = center.x + Math.cos(node.orbitAngle) * node.orbitRadius;
                    const ty = center.y + Math.sin(node.orbitAngle) * node.orbitRadius;
                    node.x += (tx - node.x) * 0.08;
                    node.y += (ty - node.y) * 0.08;
                });
                return;
            }

            if (layoutMode === "lattice") {
                // Structured topological lattice
                const k = 0.08;
                const damping = 0.82;
                edges.forEach(edge => {
                    const dx = edge.target.x - edge.source.x;
                    const dy = edge.target.y - edge.source.y;
                    const dist = Math.hypot(dx, dy) || 1;
                    const targetDist = edge.isConceptEdge ? 130 : 160;
                    const force = (dist - targetDist) * k;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    edge.source.vx += fx; edge.source.vy += fy;
                    edge.target.vx -= fx; edge.target.vy -= fy;
                });

                nodes.forEach(node => {
                    if (node === dragNode) return;
                    node.x += node.vx; node.y += node.vy;
                    node.vx *= damping; node.vy *= damping;
                    // Centering
                    node.x += (center.x - node.x) * 0.005;
                    node.y += (center.y - node.y) * 0.005;
                });
                return;
            }

            // Default Galaxy (Force-Atlas / Organic Physics)
            const k = 0.045; // Spring constant
            const damping = 0.86;
            const repulsion = 2400;

            // Spring forces along edges
            edges.forEach(edge => {
                const dx = edge.target.x - edge.source.x;
                const dy = edge.target.y - edge.source.y;
                const dist = Math.hypot(dx, dy) || 1;
                const targetDist = edge.source.isHub || edge.target.isHub ? 130 : (edge.isConceptEdge ? 160 : 190);
                const force = (dist - targetDist) * k;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                edge.source.vx += fx;
                edge.source.vy += fy;
                edge.target.vx -= fx;
                edge.target.vy -= fy;
            });

            // Repulsion between all node pairs
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const n1 = nodes[i];
                    const n2 = nodes[j];
                    const dx = n2.x - n1.x;
                    const dy = n2.y - n1.y;
                    const distSq = dx * dx + dy * dy || 1;
                    if (distSq < 48000) {
                        const force = repulsion / distSq;
                        const dist = Math.sqrt(distSq);
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;
                        n1.vx -= fx; n1.vy -= fy;
                        n2.vx += fx; n2.vy += fy;
                    }
                }

                // Centering gravity pull
                const dx = center.x - nodes[i].x;
                const dy = center.y - nodes[i].y;
                nodes[i].vx += dx * 0.0012;
                nodes[i].vy += dy * 0.0012;
            }

            // Apply velocities & boundaries
            nodes.forEach(node => {
                if (node === dragNode) return;
                node.x += node.vx;
                node.y += node.vy;
                node.vx *= damping;
                node.vy *= damping;

                if (node.x < 30) { node.x = 30; node.vx *= -1; }
                if (node.x > width - 30) { node.x = width - 30; node.vx *= -1; }
                if (node.y < 30) { node.y = 30; node.vy *= -1; }
                if (node.y > height - 30) { node.y = height - 30; node.vy *= -1; }
            });
        }

        function loop() {
            if (!isGraphView) return;
            simulate();
            draw();
            animationId = requestAnimationFrame(loop);
        }

        // ---------------------------------------------------------------------
        // Interactive Mouse, Pan, Zoom & Touch Handlers
        // ---------------------------------------------------------------------
        let isDraggingCanvas = false;
        let isDraggingNode = false;
        let dragNode = null;
        let lastMousePos = { x: 0, y: 0 };

        function getTransformedMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const canvasX = (clientX - rect.left) * (canvas.width / (rect.width * (window.devicePixelRatio || 1)));
            const canvasY = (clientY - rect.top) * (canvas.height / (rect.height * (window.devicePixelRatio || 1)));

            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);

            // Invert camera transform:
            // Screen -> Center Translate -> Zoom Scale -> Camera Offset -> World
            const worldX = (canvasX - (width / 2 + camera.x)) / camera.zoom + width / 2;
            const worldY = (canvasY - (height / 2 + camera.y)) / camera.zoom + height / 2;

            return { worldX, worldY, clientX, clientY, canvasX, canvasY };
        }

        canvas.addEventListener("mousemove", (e) => {
            if (!isGraphView) return;
            const pos = getTransformedMousePos(e);

            if (isDraggingCanvas) {
                camera.x += pos.clientX - lastMousePos.x;
                camera.y += pos.clientY - lastMousePos.y;
                lastMousePos = { x: pos.clientX, y: pos.clientY };
                return;
            }

            if (isDraggingNode && dragNode) {
                dragNode.x = pos.worldX;
                dragNode.y = pos.worldY;
                dragNode.vx = 0;
                dragNode.vy = 0;
                return;
            }

            // Check Hovered Node
            hoveredNode = null;
            let minDist = 22;

            nodes.forEach(node => {
                if (!matchesActiveFilter(node)) return;
                const dist = Math.hypot(node.x - pos.worldX, node.y - pos.worldY);
                if (dist < node.radius + 8 && dist < minDist) {
                    minDist = dist;
                    hoveredNode = node;
                }
            });

            if (hoveredNode) {
                canvas.style.cursor = "pointer";
                tooltip.style.display = "block";
                tooltip.style.left = (pos.canvasX + 15) + "px";
                tooltip.style.top = (pos.canvasY - 15) + "px";
                tooltip.innerHTML = `
                    <div style="font-size:0.72rem;color:${hoveredNode.color};text-transform:uppercase;font-weight:600;margin-bottom:2px;">
                        ${catNames[hoveredNode.category] || hoveredNode.category}
                    </div>
                    <strong style="color:var(--gold);font-size:0.95rem;">${hoveredNode.title}</strong>
                    ${hoveredNode.subtitle ? `<div style="font-size:0.78rem;color:var(--muted);margin-top:2px;">${hoveredNode.subtitle}</div>` : ""}
                `;
            } else {
                canvas.style.cursor = isDraggingCanvas ? "grabbing" : "grab";
                tooltip.style.display = "none";
            }
        });

        canvas.addEventListener("mousedown", (e) => {
            const pos = getTransformedMousePos(e);
            lastMousePos = { x: pos.clientX, y: pos.clientY };

            if (hoveredNode) {
                isDraggingNode = true;
                dragNode = hoveredNode;
            } else {
                isDraggingCanvas = true;
            }
        });

        window.addEventListener("mouseup", () => {
            isDraggingCanvas = false;
            isDraggingNode = false;
            dragNode = null;
        });

        // Click to Inspect / Select Star
        canvas.addEventListener("click", (e) => {
            if (hoveredNode) {
                selectStarNode(hoveredNode);
            }
        });

        // Double-click to navigate
        canvas.addEventListener("dblclick", () => {
            if (hoveredNode && hoveredNode.url) {
                window.location.href = hoveredNode.url;
            }
        });

        // Mouse Wheel Zoom
        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY < 0 ? 1.12 : 0.89;
            const newZoom = Math.min(2.5, Math.max(0.45, camera.zoom * zoomDelta));
            camera.zoom = newZoom;
        }, { passive: false });

        // Touch support for mobile pan & pinch
        canvas.addEventListener("touchstart", (e) => {
            const pos = getTransformedMousePos(e);
            lastMousePos = { x: pos.clientX, y: pos.clientY };
            if (hoveredNode) {
                isDraggingNode = true;
                dragNode = hoveredNode;
            } else {
                isDraggingCanvas = true;
            }
        }, { passive: true });

        canvas.addEventListener("touchmove", (e) => {
            if (!isGraphView) return;
            const pos = getTransformedMousePos(e);
            if (isDraggingCanvas) {
                camera.x += pos.clientX - lastMousePos.x;
                camera.y += pos.clientY - lastMousePos.y;
                lastMousePos = { x: pos.clientX, y: pos.clientY };
            } else if (isDraggingNode && dragNode) {
                dragNode.x = pos.worldX;
                dragNode.y = pos.worldY;
            }
        }, { passive: true });

        canvas.addEventListener("touchend", () => {
            isDraggingCanvas = false;
            isDraggingNode = false;
            dragNode = null;
        });

        // Star Inspector Card Logic
        function selectStarNode(node) {
            selectedNode = node;
            if (!inspectorCard) return;

            const catTag = document.getElementById("inspector-cat-tag");
            const readTimeEl = document.getElementById("inspector-read-time");
            const titleEl = document.getElementById("inspector-title");
            const subEl = document.getElementById("inspector-subtitle");
            const excerptEl = document.getElementById("inspector-excerpt");
            const conceptsContainer = document.getElementById("inspector-concepts-list");
            const readLink = document.getElementById("inspector-read-link");
            const focusBtn = document.getElementById("inspector-focus-btn");

            if (catTag) {
                catTag.textContent = catNames[node.category] || node.category;
                catTag.style.color = node.color;
                catTag.style.borderColor = node.color;
            }
            if (readTimeEl) readTimeEl.textContent = node.readTime || "Celestial Node";
            if (titleEl) titleEl.textContent = node.title;
            if (subEl) subEl.textContent = node.subtitle || "";
            if (excerptEl) excerptEl.textContent = node.excerpt || "Interactive node in the celestial knowledge network.";

            if (conceptsContainer) {
                conceptsContainer.innerHTML = "";
                if (node.concepts && node.concepts.length > 0) {
                    node.concepts.forEach(c => {
                        const pill = document.createElement("span");
                        pill.className = "inspector-concept-tag";
                        pill.textContent = "[[" + c + "]]";
                        pill.addEventListener("click", () => {
                            const conceptNode = nodes.find(n => n.title === "[[" + c + "]]");
                            if (conceptNode) selectStarNode(conceptNode);
                        });
                        conceptsContainer.appendChild(pill);
                    });
                } else {
                    conceptsContainer.innerHTML = '<span style="font-size:0.76rem;color:var(--muted);">No linked concepts</span>';
                }
            }

            if (readLink) {
                if (node.url) {
                    readLink.href = node.url;
                    readLink.style.display = "inline-flex";
                } else {
                    readLink.style.display = "none";
                }
            }

            if (focusBtn) {
                focusBtn.onclick = () => {
                    isolatedNode = (isolatedNode === node) ? null : node;
                    focusBtn.textContent = isolatedNode ? "Show All ✧" : "Focus Star ✧";
                };
            }

            inspectorCard.removeAttribute("hidden");
        }

        const inspectorCloseBtn = document.getElementById("inspector-close-btn");
        if (inspectorCloseBtn) {
            inspectorCloseBtn.addEventListener("click", () => {
                if (inspectorCard) inspectorCard.setAttribute("hidden", "");
                selectedNode = null;
                isolatedNode = null;
            });
        }

        // Toggle Grid vs. Constellation View
        toggleBtn.addEventListener("click", () => {
            isGraphView = !isGraphView;
            if (isGraphView) {
                toggleBtn.textContent = "📑 Grid View";
                toggleBtn.style.color = "var(--ink)";
                toggleBtn.style.borderColor = "var(--line)";
                gridContainer.style.display = "none";
                graphContainer.style.display = "flex";
                resizeCanvas();
                initGraphData();
                loop();
            } else {
                toggleBtn.textContent = "🌌 Constellation View";
                toggleBtn.style.color = "var(--teal)";
                toggleBtn.style.borderColor = "var(--teal)";
                gridContainer.style.display = "grid";
                graphContainer.style.display = "none";
                if (inspectorCard) inspectorCard.setAttribute("hidden", "");
                cancelAnimationFrame(animationId);
            }
        });

        // ---------------------------------------------------------------------
        // HUD Controls (Filters, Search, Layouts, Zoom)
        // ---------------------------------------------------------------------
        const filterChips = document.querySelectorAll("#constellation-cluster-filters .c-filter-chip");
        filterChips.forEach(chip => {
            chip.addEventListener("click", () => {
                filterChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                activeCluster = chip.getAttribute("data-cluster") || "all";
            });
        });

        const layoutButtons = document.querySelectorAll("#constellation-layout-modes .c-layout-btn");
        layoutButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                layoutButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                layoutMode = btn.getAttribute("data-layout") || "galaxy";
            });
        });

        const searchInput = document.getElementById("constellation-search-input");
        const searchClear = document.getElementById("constellation-search-clear");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                if (searchClear) searchClear.style.display = searchQuery ? "block" : "none";
            });
        }
        if (searchClear) {
            searchClear.addEventListener("click", () => {
                if (searchInput) searchInput.value = "";
                searchQuery = "";
                searchClear.style.display = "none";
            });
        }

        const zoomInBtn = document.getElementById("c-zoom-in");
        const zoomOutBtn = document.getElementById("c-zoom-out");
        const zoomResetBtn = document.getElementById("c-zoom-reset");
        const toggleParticlesBtn = document.getElementById("c-toggle-particles");
        const toggleNebulaeBtn = document.getElementById("c-toggle-nebulae");

        if (zoomInBtn) zoomInBtn.addEventListener("click", () => { camera.zoom = Math.min(2.5, camera.zoom * 1.25); });
        if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => { camera.zoom = Math.max(0.45, camera.zoom * 0.8); });
        if (zoomResetBtn) zoomResetBtn.addEventListener("click", () => { camera.zoom = 1.0; camera.x = 0; camera.y = 0; });
        if (toggleParticlesBtn) {
            toggleParticlesBtn.addEventListener("click", () => {
                enableParticles = !enableParticles;
                toggleParticlesBtn.classList.toggle("active", enableParticles);
            });
        }
        if (toggleNebulaeBtn) {
            toggleNebulaeBtn.addEventListener("click", () => {
                enableNebulae = !enableNebulae;
                toggleNebulaeBtn.classList.toggle("active", enableNebulae);
            });
        }

        window.addEventListener("resize", () => {
            if (isGraphView) resizeCanvas();
        });
    }


    // ==========================================
    const toggleBlockModeBtn = document.getElementById("toggle-block-mode-btn");
    const blockEditorContainer = document.getElementById("block-editor-container");
    const syntaxLayer = document.getElementById("syntax-layer");
    const bodyInput = document.getElementById("studio-body");
    
    let isBlockMode = false;
    
    if (toggleBlockModeBtn && blockEditorContainer && bodyInput) {
        toggleBlockModeBtn.addEventListener("click", () => {
            isBlockMode = !isBlockMode;
            if (isBlockMode) {
                toggleBlockModeBtn.style.background = "var(--teal)";
                toggleBlockModeBtn.style.color = "var(--bg)";
                bodyInput.style.display = "none";
                if (syntaxLayer) syntaxLayer.style.display = "none";
                blockEditorContainer.style.display = "block";
                syncMarkdownToBlocks();
            } else {
                toggleBlockModeBtn.style.background = "transparent";
                toggleBlockModeBtn.style.color = "var(--teal)";
                bodyInput.style.display = "block";
                if (syntaxLayer) syntaxLayer.style.display = "block";
                blockEditorContainer.style.display = "none";
                syncBlocksToMarkdown();
            }
        });
        
        function syncMarkdownToBlocks() {
            blockEditorContainer.innerHTML = "";
            const content = bodyInput.value;
            // Split by double newline to get distinct blocks (paragraphs)
            const blocks = content.split(/\n\n/).filter(b => b.trim() !== "");
            
            if (blocks.length === 0) {
                createBlock("");
            } else {
                blocks.forEach(text => createBlock(text));
            }
        }
        
        function syncBlocksToMarkdown() {
            const blockInputs = blockEditorContainer.querySelectorAll(".block-input");
            const texts = Array.from(blockInputs).map(input => input.value);
            bodyInput.value = texts.join("\n\n");
            // Trigger live preview update
            const event = new Event("input");
            bodyInput.dispatchEvent(event);
        }
        
        function createBlock(text, insertAfterElement = null) {
            const blockWrapper = document.createElement("div");
            blockWrapper.className = "atomic-block-wrapper";
            blockWrapper.style.cssText = "position: relative; margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px; group;";
            
            const dragHandle = document.createElement("div");
            dragHandle.innerHTML = "⋮⋮";
            dragHandle.style.cssText = "color: var(--muted); cursor: grab; font-size: 1.2rem; user-select: none; padding-top: 4px; opacity: 0.3; transition: opacity 0.2s;";
            
            blockWrapper.addEventListener("mouseenter", () => dragHandle.style.opacity = "1");
            blockWrapper.addEventListener("mouseleave", () => dragHandle.style.opacity = "0.3");
            
            const textarea = document.createElement("textarea");
            textarea.className = "block-input studio-textarea";
            textarea.value = text;
            textarea.style.cssText = "flex: 1; min-height: 24px; padding: 4px 0; border: none; background: transparent; resize: none; overflow: hidden; font-size: 1.15rem; font-family: var(--font-serif); line-height: 1.6; color: var(--text-main);";
            textarea.placeholder = "Type a block ( / for commands )";
            
            // Auto resize
            const autoResize = () => {
                textarea.style.height = "auto";
                textarea.style.height = textarea.scrollHeight + "px";
            };
            textarea.addEventListener("input", () => {
                autoResize();
                syncBlocksToMarkdown();
            });
            setTimeout(autoResize, 10);
            
            // Keyboard navigation and creation
            textarea.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    // Split the text at cursor
                    const cursorIndex = textarea.selectionStart;
                    const textBefore = textarea.value.substring(0, cursorIndex);
                    const textAfter = textarea.value.substring(cursorIndex);
                    
                    textarea.value = textBefore;
                    autoResize();
                    
                    const newBlock = createBlock(textAfter, blockWrapper);
                    newBlock.querySelector("textarea").focus();
                    syncBlocksToMarkdown();
                }
                
                if (e.key === "Backspace" && textarea.value === "") {
                    e.preventDefault();
                    const prev = blockWrapper.previousElementSibling;
                    if (prev) {
                        const prevTextarea = prev.querySelector("textarea");
                        prevTextarea.focus();
                        prevTextarea.selectionStart = prevTextarea.value.length;
                        blockWrapper.remove();
                        syncBlocksToMarkdown();
                    }
                }
                
                if (e.key === "ArrowUp") {
                    const prev = blockWrapper.previousElementSibling;
                    if (prev) prev.querySelector("textarea").focus();
                }
                
                if (e.key === "ArrowDown") {
                    const next = blockWrapper.nextElementSibling;
                    if (next) next.querySelector("textarea").focus();
                }
            });
            
            blockWrapper.appendChild(dragHandle);
            blockWrapper.appendChild(textarea);
            
            if (insertAfterElement && insertAfterElement.nextSibling) {
                blockEditorContainer.insertBefore(blockWrapper, insertAfterElement.nextSibling);
            } else {
                blockEditorContainer.appendChild(blockWrapper);
            }
            
            return blockWrapper;
        }
    }
    initProjectDrawers();
    // =========================================================================
    // Project Technical Spec Slide-Out Drawers & Interactive Visualizers
    // =========================================================================
    function initProjectDrawers() {
        const drawerModal = document.getElementById("project-drawer-modal");
        if (!drawerModal) return;

        const drawerBackdrop = document.getElementById("project-drawer-backdrop");
        const drawerCloseBtn = document.getElementById("drawer-close-btn");
        const drawerTitle = document.getElementById("drawer-title");
        const drawerRole = document.getElementById("drawer-role");
        const drawerGhLink = document.getElementById("drawer-github-link");
        const drawerBody = document.getElementById("drawer-body");
        let currentSimCleanup = null;

        function closeDrawer() {
            if (currentSimCleanup) {
                currentSimCleanup();
                currentSimCleanup = null;
            }
            drawerModal.classList.remove("open");
            setTimeout(() => {
                drawerModal.setAttribute("hidden", "");
            }, 320);
        }

        if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
        if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && drawerModal.classList.contains("open")) {
                closeDrawer();
            }
        });

        // Trigger buttons
        document.querySelectorAll(".proj-spec-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const projKey = btn.getAttribute("data-project");
                if (projKey) openProjectSpec(projKey);
            });
        });

        const SPECS = {
            sat: {
                title: "SAT Physics & Collision Engine",
                role: "Computational Geometry · Continuous 3D Physics · C++20",
                tag: "02.2 // Low-Level Systems & Geometry",
                github: "https://github.com/zhangzachary834-commits/Earthcall",
                lead: "A continuous 3D convex polyhedron collision detection and contact manifold extraction engine implementing the Separating Axis Theorem (SAT) in modern C++20 with zero dynamic heap allocations in inner loops.",
                render: (container) => {
                    container.innerHTML = `
                        <div class="drawer-section">
                            <span class="drawer-section-title">Interactive SAT Collision Simulator</span>
                            <div class="drawer-sim-box">
                                <div class="drawer-sim-header">
                                    <div class="drawer-sim-controls">
                                        <button class="drawer-sim-btn active" id="sat-shape-box">Box vs Box</button>
                                        <button class="drawer-sim-btn" id="sat-shape-tri">Box vs Triangle</button>
                                        <button class="drawer-sim-btn" id="sat-shape-poly">Pentagon vs Hexagon</button>
                                        <button class="drawer-sim-btn" id="sat-reset-btn">Reset</button>
                                    </div>
                                    <span id="sat-status-badge" class="drawer-sim-status status-separated">○ SEPARATED (AXIS FOUND)</span>
                                </div>
                                <div class="drawer-sim-canvas-wrapper">
                                    <canvas id="sat-canvas" class="drawer-sim-canvas" width="680" height="260"></canvas>
                                </div>
                                <div class="drawer-sim-controls">
                                    <div class="drawer-sim-slider-group">
                                        <label for="sat-rot-slider">Shape B Rotation:</label>
                                        <input type="range" id="sat-rot-slider" class="drawer-sim-slider" min="0" max="360" value="25">
                                        <span id="sat-rot-val">25°</span>
                                    </div>
                                    <span style="color:var(--muted);font-size:0.78rem;">Drag Shape A (cyan) with mouse/touch to test separating axes in real-time.</span>
                                </div>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">Substrate Performance Benchmarks</span>
                            <div class="drawer-metrics-grid">
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">100,000 / 1.8 ms</span>
                                    <span class="drawer-metric-label">Collision Queries Rate</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">0 Bytes</span>
                                    <span class="drawer-metric-label">Heap Allocation / Query</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">15 Axes (OBB)</span>
                                    <span class="drawer-metric-label">Face Normals + Cross Edges</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">C++20 &amp; WGSL</span>
                                    <span class="drawer-metric-label">Shader &amp; Host Symmetry</span>
                                </div>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">Architectural Principles &amp; Algorithms</span>
                            <div class="drawer-cards-grid">
                                <div class="drawer-info-card">
                                    <h4>Axis Projection Pipeline</h4>
                                    <p>Computes candidate separating axes from face normals of Polyhedron A, face normals of Polyhedron B, and all cross products of edge pairs (15 candidate axes for 3D OBBs; N + M + E1×E2 for general convex polyhedra).</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>Contact Manifold Extraction</h4>
                                    <p>When all candidate axes overlap, finds the axis of minimal penetration depth (Minimum Translation Vector) and clips incident face vertices against reference face planes to form stable contact manifolds.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>Zero Dynamic Allocation Invariant</h4>
                                    <p>Inner loop evaluation uses fixed-capacity stack storage and SIMD registers, avoiding heap fragmentation and GC jitter in low-level physics loops.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>OntoMath Integration</h4>
                                    <p>Direct spatial constraint solver within Earthcall's OntoMath law layer, allowing runtime authoring of physical boundaries without rigid class hierarchies.</p>
                                </div>
                            </div>
                        </div>
                    `;

                    const canvas = document.getElementById("sat-canvas");
                    if (!canvas) return;
                    const ctx = canvas.getContext("2d");
                    const statusBadge = document.getElementById("sat-status-badge");
                    const rotSlider = document.getElementById("sat-rot-slider");
                    const rotVal = document.getElementById("sat-rot-val");
                    const resetBtn = document.getElementById("sat-reset-btn");

                    let shapeType = "box";
                    let angleB = (25 * Math.PI) / 180;
                    let isDragging = false;
                    let dragOffset = { x: 0, y: 0 };
                    let animId = null;

                    let posA = { x: 180, y: 130 };
                    let posB = { x: 440, y: 130 };

                    function getVerticesA() {
                        if (shapeType === "box" || shapeType === "tri") {
                            const hw = 55, hh = 45;
                            return [
                                { x: posA.x - hw, y: posA.y - hh },
                                { x: posA.x + hw, y: posA.y - hh },
                                { x: posA.x + hw, y: posA.y + hh },
                                { x: posA.x - hw, y: posA.y + hh }
                            ];
                        } else {
                            const r = 50;
                            const verts = [];
                            for (let i = 0; i < 5; i++) {
                                const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                                verts.push({ x: posA.x + r * Math.cos(a), y: posA.y + r * Math.sin(a) });
                            }
                            return verts;
                        }
                    }

                    function getVerticesB() {
                        if (shapeType === "box") {
                            const hw = 60, hh = 50;
                            const local = [
                                { x: -hw, y: -hh },
                                { x: hw, y: -hh },
                                { x: hw, y: hh },
                                { x: -hw, y: hh }
                            ];
                            const cos = Math.cos(angleB), sin = Math.sin(angleB);
                            return local.map(v => ({
                                x: posB.x + (v.x * cos - v.y * sin),
                                y: posB.y + (v.x * sin + v.y * cos)
                            }));
                        } else if (shapeType === "tri") {
                            const local = [
                                { x: 0, y: -55 },
                                { x: 55, y: 45 },
                                { x: -55, y: 45 }
                            ];
                            const cos = Math.cos(angleB), sin = Math.sin(angleB);
                            return local.map(v => ({
                                x: posB.x + (v.x * cos - v.y * sin),
                                y: posB.y + (v.x * sin + v.y * cos)
                            }));
                        } else {
                            const r = 52;
                            const verts = [];
                            const cos = Math.cos(angleB), sin = Math.sin(angleB);
                            for (let i = 0; i < 6; i++) {
                                const a = (i * 2 * Math.PI) / 6;
                                const lx = r * Math.cos(a);
                                const ly = r * Math.sin(a);
                                verts.push({
                                    x: posB.x + (lx * cos - ly * sin),
                                    y: posB.y + (lx * sin + ly * cos)
                                });
                            }
                            return verts;
                        }
                    }

                    function getAxes(verts) {
                        const axes = [];
                        for (let i = 0; i < verts.length; i++) {
                            const p1 = verts[i];
                            const p2 = verts[(i + 1) % verts.length];
                            const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
                            const normal = { x: -edge.y, y: edge.x };
                            const len = Math.hypot(normal.x, normal.y);
                            if (len > 0.0001) {
                                axes.push({ x: normal.x / len, y: normal.y / len });
                            }
                        }
                        return axes;
                    }

                    function projectPolygon(axis, verts) {
                        let min = Infinity;
                        let max = -Infinity;
                        for (let v of verts) {
                            const dot = v.x * axis.x + v.y * axis.y;
                            if (dot < min) min = dot;
                            if (dot > max) max = dot;
                        }
                        return { min, max };
                    }

                    function checkSAT(vertsA, vertsB) {
                        const axes = [...getAxes(vertsA), ...getAxes(vertsB)];
                        let minOverlap = Infinity;
                        let mtvAxis = null;
                        let separatingAxis = null;

                        for (let axis of axes) {
                            const pA = projectPolygon(axis, vertsA);
                            const pB = projectPolygon(axis, vertsB);

                            if (pA.max < pB.min || pB.max < pA.min) {
                                separatingAxis = axis;
                                return { colliding: false, separatingAxis: axis };
                            } else {
                                const overlap = Math.min(pA.max - pB.min, pB.max - pA.min);
                                if (overlap < minOverlap) {
                                    minOverlap = overlap;
                                    mtvAxis = axis;
                                }
                            }
                        }
                        return { colliding: true, overlap: minOverlap, mtvAxis: mtvAxis };
                    }

                    function draw() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        const vertsA = getVerticesA();
                        const vertsB = getVerticesB();
                        const result = checkSAT(vertsA, vertsB);

                        // Grid
                        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
                        ctx.lineWidth = 1;
                        for (let x = 0; x < canvas.width; x += 30) {
                            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
                        }
                        for (let y = 0; y < canvas.height; y += 30) {
                            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                        }

                        if (!result.colliding && result.separatingAxis) {
                            statusBadge.className = "drawer-sim-status status-separated";
                            statusBadge.textContent = "○ SEPARATED (HYPERPLANE FOUND)";

                            const midX = (posA.x + posB.x) / 2;
                            const midY = (posA.y + posB.y) / 2;
                            const ax = result.separatingAxis;

                            const planeX = -ax.y;
                            const planeY = ax.x;
                            ctx.strokeStyle = "rgba(110, 231, 216, 0.7)";
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(midX - planeX * 180, midY - planeY * 180);
                            ctx.lineTo(midX + planeX * 180, midY + planeY * 180);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.strokeStyle = "#38bdf8";
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(midX, midY);
                            ctx.lineTo(midX + ax.x * 45, midY + ax.y * 45);
                            ctx.stroke();
                        } else {
                            statusBadge.className = "drawer-sim-status status-colliding";
                            statusBadge.textContent = `● COLLIDING (OVERLAP: ${result.overlap.toFixed(1)} px)`;

                            if (result.mtvAxis) {
                                ctx.strokeStyle = "#ef4444";
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(posA.x, posA.y);
                                ctx.lineTo(posA.x + result.mtvAxis.x * result.overlap * 1.5, posA.y + result.mtvAxis.y * result.overlap * 1.5);
                                ctx.stroke();
                            }
                        }

                        // Shape B (Gold)
                        ctx.fillStyle = "rgba(216, 180, 110, 0.25)";
                        ctx.strokeStyle = "#d8b46e";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        vertsB.forEach((v, idx) => {
                            if (idx === 0) ctx.moveTo(v.x, v.y);
                            else ctx.lineTo(v.x, v.y);
                        });
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();

                        // Shape A (Cyan)
                        ctx.fillStyle = result.colliding ? "rgba(248, 113, 113, 0.3)" : "rgba(110, 231, 216, 0.3)";
                        ctx.strokeStyle = result.colliding ? "#f87171" : "#6ee7d8";
                        ctx.lineWidth = 2.5;
                        ctx.beginPath();
                        vertsA.forEach((v, idx) => {
                            if (idx === 0) ctx.moveTo(v.x, v.y);
                            else ctx.lineTo(v.x, v.y);
                        });
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();

                        ctx.fillStyle = "#fff";
                        ctx.font = "11px monospace";
                        ctx.fillText("Shape A (Drag Me)", posA.x - 45, posA.y + 4);
                        ctx.fillText("Shape B (Target)", posB.x - 40, posB.y + 4);

                        animId = requestAnimationFrame(draw);
                    }

                    function onPointerDown(e) {
                        const rect = canvas.getBoundingClientRect();
                        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                        const x = (clientX - rect.left) * (canvas.width / rect.width);
                        const y = (clientY - rect.top) * (canvas.height / rect.height);

                        if (Math.hypot(x - posA.x, y - posA.y) < 70) {
                            isDragging = true;
                            dragOffset.x = x - posA.x;
                            dragOffset.y = y - posA.y;
                        }
                    }

                    function onPointerMove(e) {
                        if (!isDragging) return;
                        const rect = canvas.getBoundingClientRect();
                        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                        posA.x = (clientX - rect.left) * (canvas.width / rect.width) - dragOffset.x;
                        posA.y = (clientY - rect.top) * (canvas.height / rect.height) - dragOffset.y;
                    }

                    function onPointerUp() {
                        isDragging = false;
                    }

                    canvas.addEventListener("mousedown", onPointerDown);
                    window.addEventListener("mousemove", onPointerMove);
                    window.addEventListener("mouseup", onPointerUp);

                    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
                    window.addEventListener("touchmove", onPointerMove, { passive: true });
                    window.addEventListener("touchend", onPointerUp);

                    const btnBox = document.getElementById("sat-shape-box");
                    const btnTri = document.getElementById("sat-shape-tri");
                    const btnPoly = document.getElementById("sat-shape-poly");

                    function setShape(type, activeBtn) {
                        shapeType = type;
                        [btnBox, btnTri, btnPoly].forEach(b => b.classList.remove("active"));
                        activeBtn.classList.add("active");
                    }

                    btnBox.addEventListener("click", () => setShape("box", btnBox));
                    btnTri.addEventListener("click", () => setShape("tri", btnTri));
                    btnPoly.addEventListener("click", () => setShape("poly", btnPoly));

                    rotSlider.addEventListener("input", (e) => {
                        const deg = parseInt(e.target.value, 10);
                        rotVal.textContent = `${deg}°`;
                        angleB = (deg * Math.PI) / 180;
                    });

                    resetBtn.addEventListener("click", () => {
                        posA = { x: 180, y: 130 };
                        posB = { x: 440, y: 130 };
                        rotSlider.value = 25;
                        rotVal.textContent = "25°";
                        angleB = (25 * Math.PI) / 180;
                    });

                    draw();

                    return () => {
                        if (animId) cancelAnimationFrame(animId);
                        window.removeEventListener("mousemove", onPointerMove);
                        window.removeEventListener("mouseup", onPointerUp);
                        window.removeEventListener("touchmove", onPointerMove);
                        window.removeEventListener("touchend", onPointerUp);
                    };
                }
            },

            robotics: {
                title: "Vision Pipeline & JAKA Manipulator",
                role: "Spatial Perception · Remote CUDA VLA · Teleoperation",
                tag: "02.1 // Spatial AI & Robotics",
                github: "https://github.com/zhangzachary834-commits",
                lead: "Full-stack perception and manipulator control pipeline: OpenVLA-OFT (7B Vision-Language-Action) running on remote CUDA, Intel RealSense depth registration, AprilTag pose calibration, and a live teleoperation dashboard jogging a 6-DOF JAKA Zu 7 arm.",
                render: (container) => {
                    container.innerHTML = `
                        <div class="drawer-section">
                            <span class="drawer-section-title">Interactive Manipulator Kinematics &amp; Pose Simulator</span>
                            <div class="drawer-sim-box">
                                <div class="drawer-sim-header">
                                    <div class="drawer-sim-controls">
                                        <button class="drawer-sim-btn active" id="jaka-play-btn">▶ Run Jog Cycle</button>
                                        <button class="drawer-sim-btn" id="jaka-gripper-btn">Toggle Gripper (Open)</button>
                                        <button class="drawer-sim-btn" id="jaka-reset-btn">Home Pose</button>
                                    </div>
                                    <span id="jaka-status-badge" class="drawer-sim-status status-separated">● SERVO LOOP ACTIVE (8ms)</span>
                                </div>
                                <div class="drawer-sim-canvas-wrapper">
                                    <canvas id="jaka-canvas" class="drawer-sim-canvas" width="680" height="260"></canvas>
                                </div>
                                <div class="drawer-sim-controls" style="gap:16px;">
                                    <div class="drawer-sim-slider-group">
                                        <label for="jaka-q1">Joint 1 (Base):</label>
                                        <input type="range" id="jaka-q1" class="drawer-sim-slider" min="-90" max="90" value="-30">
                                        <span id="jaka-q1-val">-30°</span>
                                    </div>
                                    <div class="drawer-sim-slider-group">
                                        <label for="jaka-q2">Joint 2 (Elbow):</label>
                                        <input type="range" id="jaka-q2" class="drawer-sim-slider" min="-120" max="120" value="65">
                                        <span id="jaka-q2-val">65°</span>
                                    </div>
                                    <div class="drawer-sim-slider-group">
                                        <label for="jaka-q3">Joint 3 (Wrist):</label>
                                        <input type="range" id="jaka-q3" class="drawer-sim-slider" min="-90" max="90" value="-20">
                                        <span id="jaka-q3-val">-20°</span>
                                    </div>
                                </div>
                                <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.78rem;color:var(--muted);background:rgba(0,0,0,0.3);padding:8px 12px;border-radius:var(--radius-sm);border:1px solid var(--line);">
                                    <span>End-Effector Pose: <strong id="jaka-pose-readout" style="color:var(--gold);">X: 384mm | Y: 215mm</strong></span>
                                    <span>AprilTag Calib: <strong style="color:var(--teal);">T_cam^base [Aligned]</strong></span>
                                    <span>VLA Action: <strong style="color:var(--cyan);">Δx:+2.4mm, Δz:-1.1mm</strong></span>
                                </div>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">Robotics &amp; VLA Stack Metrics</span>
                            <div class="drawer-metrics-grid">
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">OpenVLA-OFT</span>
                                    <span class="drawer-metric-label">7B Vision-Action Model</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">~85 ms</span>
                                    <span class="drawer-metric-label">Remote CUDA Inference</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">30 FPS RGB-D</span>
                                    <span class="drawer-metric-label">RealSense D435i Stream</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">6-DOF Zu 7</span>
                                    <span class="drawer-metric-label">JAKA Arm Manipulator</span>
                                </div>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">System Pipeline &amp; Architectural Refusals</span>
                            <div class="drawer-cards-grid">
                                <div class="drawer-info-card">
                                    <h4>AprilTag 3 Extrinsic Calibration</h4>
                                    <p>Computes rigid SE(3) transformation matrix between RealSense optical frame and JAKA base frame, eliminating manual calibration drift.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>Remote CUDA / macOS Hybrid</h4>
                                    <p>Lightweight macOS control surface streams RGB-D frames over zero-latency IPC sockets to remote RTX 4090 CUDA nodes, streaming back 7D delta action tokens.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>Safety-Gated Trajectory Servoing</h4>
                                    <p>Every generated VLA delta action passes through joint boundary limiters and velocity smoothing filters before being dispatched to the JAKA SDK.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>Live Teleoperation Dashboard</h4>
                                    <p>Real-time operator interface displaying joint torque telemetry, tracker pose jogs, point cloud overlays, and manual emergency stops.</p>
                                </div>
                            </div>
                        </div>
                    `;

                    const canvas = document.getElementById("jaka-canvas");
                    if (!canvas) return;
                    const ctx = canvas.getContext("2d");
                    const q1Slider = document.getElementById("jaka-q1");
                    const q2Slider = document.getElementById("jaka-q2");
                    const q3Slider = document.getElementById("jaka-q3");
                    const q1Val = document.getElementById("jaka-q1-val");
                    const q2Val = document.getElementById("jaka-q2-val");
                    const q3Val = document.getElementById("jaka-q3-val");
                    const poseReadout = document.getElementById("jaka-pose-readout");
                    const playBtn = document.getElementById("jaka-play-btn");
                    const gripperBtn = document.getElementById("jaka-gripper-btn");
                    const resetBtn = document.getElementById("jaka-reset-btn");

                    let q1 = (-30 * Math.PI) / 180;
                    let q2 = (65 * Math.PI) / 180;
                    let q3 = (-20 * Math.PI) / 180;
                    let gripperOpen = true;
                    let isPlaying = false;
                    let playTime = 0;
                    let animId = null;

                    const L1 = 90;
                    const L2 = 80;
                    const L3 = 45;
                    const baseX = 140;
                    const baseY = 210;

                    function draw() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        if (isPlaying) {
                            playTime += 0.03;
                            q1 = -0.6 + Math.sin(playTime) * 0.45;
                            q2 = 1.0 + Math.cos(playTime * 0.8) * 0.5;
                            q3 = -0.4 + Math.sin(playTime * 1.2) * 0.3;
                            q1Slider.value = Math.round((q1 * 180) / Math.PI);
                            q2Slider.value = Math.round((q2 * 180) / Math.PI);
                            q3Slider.value = Math.round((q3 * 180) / Math.PI);
                            q1Val.textContent = `${q1Slider.value}°`;
                            q2Val.textContent = `${q2Slider.value}°`;
                            q3Val.textContent = `${q3Slider.value}°`;
                        }

                        const p0 = { x: baseX, y: baseY };
                        const a1 = -Math.PI / 2 + q1;
                        const p1 = { x: p0.x + L1 * Math.cos(a1), y: p0.y + L1 * Math.sin(a1) };
                        const a2 = a1 + q2;
                        const p2 = { x: p1.x + L2 * Math.cos(a2), y: p1.y + L2 * Math.sin(a2) };
                        const a3 = a2 + q3;
                        const p3 = { x: p2.x + L3 * Math.cos(a3), y: p2.y + L3 * Math.sin(a3) };

                        if (poseReadout) {
                            poseReadout.textContent = `X: ${(p3.x * 1.5).toFixed(0)}mm | Y: ${(canvas.height - p3.y * 1.5).toFixed(0)}mm`;
                        }

                        // Ground
                        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(40, baseY + 10);
                        ctx.lineTo(canvas.width - 40, baseY + 10);
                        ctx.stroke();

                        // AprilTag Target
                        const tagX = 480, tagY = baseY - 20;
                        ctx.fillStyle = "#18181b";
                        ctx.strokeStyle = "#a1a1aa";
                        ctx.lineWidth = 1.5;
                        ctx.fillRect(tagX - 25, tagY - 25, 50, 50);
                        ctx.strokeRect(tagX - 25, tagY - 25, 50, 50);
                        ctx.fillStyle = "#fff";
                        ctx.fillRect(tagX - 18, tagY - 18, 36, 36);
                        ctx.fillStyle = "#000";
                        ctx.fillRect(tagX - 10, tagY - 10, 20, 20);
                        ctx.fillStyle = "#fff";
                        ctx.font = "9px monospace";
                        ctx.fillText("AprilTag 3", tagX - 28, tagY + 40);

                        // RealSense Camera
                        const camX = 490, camY = 40;
                        ctx.fillStyle = "#38bdf8";
                        ctx.fillRect(camX - 12, camY - 8, 24, 16);
                        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
                        ctx.beginPath();
                        ctx.moveTo(camX, camY + 8);
                        ctx.lineTo(tagX - 70, tagY + 10);
                        ctx.lineTo(tagX + 70, tagY + 10);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fillStyle = "rgba(56, 189, 248, 0.05)";
                        ctx.fill();
                        ctx.fillStyle = "#38bdf8";
                        ctx.fillText("RealSense D435i", camX - 45, camY - 14);

                        // Robot Base
                        ctx.fillStyle = "#27272a";
                        ctx.strokeStyle = "#71717a";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.roundRect(p0.x - 32, p0.y, 64, 18, [4, 4, 0, 0]);
                        ctx.fill();
                        ctx.stroke();

                        // Link 1
                        ctx.strokeStyle = "#d8b46e";
                        ctx.lineWidth = 12;
                        ctx.lineCap = "round";
                        ctx.beginPath();
                        ctx.moveTo(p0.x, p0.y);
                        ctx.lineTo(p1.x, p1.y);
                        ctx.stroke();

                        // Link 2
                        ctx.strokeStyle = "#6ee7d8";
                        ctx.lineWidth = 9;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();

                        // Link 3
                        ctx.strokeStyle = "#38bdf8";
                        ctx.lineWidth = 6;
                        ctx.beginPath();
                        ctx.moveTo(p2.x, p2.y);
                        ctx.lineTo(p3.x, p3.y);
                        ctx.stroke();

                        // Joints
                        [p0, p1, p2].forEach(p => {
                            ctx.fillStyle = "#18181b";
                            ctx.strokeStyle = "#fff";
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                        });

                        // Gripper
                        const gripSpan = gripperOpen ? 14 : 4;
                        const gAngle = a3;
                        const gx1 = p3.x + Math.cos(gAngle + Math.PI / 2) * gripSpan;
                        const gy1 = p3.y + Math.sin(gAngle + Math.PI / 2) * gripSpan;
                        const gx2 = p3.x - Math.cos(gAngle + Math.PI / 2) * gripSpan;
                        const gy2 = p3.y - Math.sin(gAngle + Math.PI / 2) * gripSpan;

                        ctx.strokeStyle = "#f87171";
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(gx1, gy1);
                        ctx.lineTo(gx1 + Math.cos(gAngle) * 16, gy1 + Math.sin(gAngle) * 16);
                        ctx.moveTo(gx2, gy2);
                        ctx.lineTo(gx2 + Math.cos(gAngle) * 16, gy2 + Math.sin(gAngle) * 16);
                        ctx.stroke();

                        animId = requestAnimationFrame(draw);
                    }

                    q1Slider.addEventListener("input", (e) => {
                        isPlaying = false;
                        q1 = (parseInt(e.target.value, 10) * Math.PI) / 180;
                        q1Val.textContent = `${e.target.value}°`;
                    });
                    q2Slider.addEventListener("input", (e) => {
                        isPlaying = false;
                        q2 = (parseInt(e.target.value, 10) * Math.PI) / 180;
                        q2Val.textContent = `${e.target.value}°`;
                    });
                    q3Slider.addEventListener("input", (e) => {
                        isPlaying = false;
                        q3 = (parseInt(e.target.value, 10) * Math.PI) / 180;
                        q3Val.textContent = `${e.target.value}°`;
                    });

                    playBtn.addEventListener("click", () => {
                        isPlaying = !isPlaying;
                        playBtn.textContent = isPlaying ? "⏸ Pause Jog" : "▶ Run Jog Cycle";
                        playBtn.classList.toggle("active", isPlaying);
                    });

                    gripperBtn.addEventListener("click", () => {
                        gripperOpen = !gripperOpen;
                        gripperBtn.textContent = gripperOpen ? "Toggle Gripper (Open)" : "Toggle Gripper (Closed)";
                    });

                    resetBtn.addEventListener("click", () => {
                        isPlaying = false;
                        playBtn.textContent = "▶ Run Jog Cycle";
                        playBtn.classList.remove("active");
                        q1Slider.value = -30; q1Val.textContent = "-30°"; q1 = (-30 * Math.PI) / 180;
                        q2Slider.value = 65; q2Val.textContent = "65°"; q2 = (65 * Math.PI) / 180;
                        q3Slider.value = -20; q3Val.textContent = "-20°"; q3 = (-20 * Math.PI) / 180;
                    });

                    draw();

                    return () => {
                        if (animId) cancelAnimationFrame(animId);
                    };
                }
            },

            earthcall: {
                title: "Earthcall Substrate Architecture",
                role: "Person-Centered Computational Ontology · C++20 / WebGPU",
                tag: "01 // Flagship Substrate Architecture",
                github: "https://github.com/zhangzachary834-commits/Earthcall",
                lead: "A foundational computational ontology that orders its attached engine. Instead of hiding a teleologically indifferent operating system behind game-engine abstractions, beings are authored in-world from registered property paths governed by runtime OntoMath Laws.",
                render: (container) => {
                    container.innerHTML = `
                        <div class="drawer-section">
                            <span class="drawer-section-title">Interactive "Tree as Ontology" Inspector</span>
                            <div class="drawer-sim-box">
                                <div class="ontology-tree-nav">
                                    <button class="ontology-tree-btn active" data-node="person">Person/</button>
                                    <button class="ontology-tree-btn" data-node="constructed">ConstructedBeing/</button>
                                    <button class="ontology-tree-btn" data-node="relation">Relation/</button>
                                    <button class="ontology-tree-btn" data-node="identity">Identity/</button>
                                    <button class="ontology-tree-btn" data-node="zones">ZonesOfEarth/</button>
                                    <button class="ontology-tree-btn" data-node="singularity">Singularity/</button>
                                    <button class="ontology-tree-btn" data-node="vessel">Vessel/</button>
                                </div>
                                <div id="ontology-node-detail" class="ontology-detail-box">
                                    <!-- Dynamic Node Breakdown -->
                                </div>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">Core Substrate Order &amp; Metrics</span>
                            <div class="drawer-metrics-grid">
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">C++20 &amp; WGSL</span>
                                    <span class="drawer-metric-label">Vessel Runtime Substrate</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">OntoMath</span>
                                    <span class="drawer-metric-label">Unified Math Language</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">Rete Laws</span>
                                    <span class="drawer-metric-label">Runtime Law Compilation</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">React / WASM</span>
                                    <span class="drawer-metric-label">Creator Console Surface</span>
                                </div>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">Load-Bearing Structural Refusals</span>
                            <div class="drawer-cards-grid">
                                <div class="drawer-info-card">
                                    <h4>No Domain Class</h4>
                                    <p>No <code>Tree</code>, <code>Vehicle</code>, or hardcoded entity classes. What a thing is is authored in-world from primitive registered property paths.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>The Tree is the Ontology</h4>
                                    <p>No arbitrary subsystem directories. Foreign hardware/software live strictly under Singularity as channels.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>Person Means Human</h4>
                                    <p>A Person is an actual human being. Generative models and autonomous bots are First Movers or Objects; they do not get a Body.</p>
                                </div>
                                <div class="drawer-info-card">
                                    <h4>No Black Box</h4>
                                    <p>Every field an entity carries is a registered property path. Unregistered is ungoverned.</p>
                                </div>
                            </div>
                        </div>
                    `;

                    const nodeDetails = {
                        person: {
                            name: "Person/",
                            tag: "Sovereignty & Human Body Root",
                            code: `// Ontological Invariant: Human beings only.
struct Person {
    BodyRef body;
    IntentionChannel intentions;
    AuthoritySignature sovereign_authority;
};
// Refusal: AI agents or generative models can never inherit from Person.`,
                            desc: "The root of all authority, intention, and telos in the system. Represents an actual human being. Generative agents coordinate and execute actions, but only a human holds sovereign ontological personhood."
                        },
                        constructed: {
                            name: "ConstructedBeing/",
                            tag: "In-World Authored Entities",
                            code: `// Domain nouns are registered property paths, not C++ classes.
struct ConstructedBeing {
    PropertyMap properties; // e.g. "density", "mass", "friction", "charge"
    FormationId formation;
    LawSubscriptionSet active_laws;
};`,
                            desc: "All in-world beings (trees, robots, structures, tools) are formed from primitive properties rather than hardcoded C++ classes. Any subsystem can inspect and govern them through OntoMath."
                        },
                        relation: {
                            name: "Relation/",
                            tag: "Relational Ontological Bindings",
                            code: `// Pure relation without intermediary entity overhead
struct Relation {
    BeingId origin;
    BeingId target;
    RelationalType type; // Proximity, Ownership, Bond, Constraint
    OntoMathTensor valence;
};`,
                            desc: "Expresses how beings connect, interact, and bind to one another. Relations are first-class ontological primitives, not hidden pointers inside game objects."
                        },
                        identity: {
                            name: "Identity/",
                            tag: "Teleological Continuity & Persistent Self",
                            code: `// Continuity preserved across save states and runtime morphs
struct PersistentIdentity {
    UUID origin_guid;
    TeleologicalLineage lineage;
    WorldSaveSnapshot state;
};`,
                            desc: "Guarantees persistent continuity of self and authored entities across world saves, spatial transitions, and morphing operations."
                        },
                        zones: {
                            name: "ZonesOfEarth/",
                            tag: "Spatial Volumes & Regional Law Contexts",
                            code: `// Regional law regimes & spatial partitioning
struct SpatialZone {
    BoundingVolume boundary;
    LawRegistry local_law_overrides;
    CoordinateFrame reference_frame;
};`,
                            desc: "Spatial volumes that establish localized environmental rules, reference coordinate frames, and regional law modifications."
                        },
                        singularity: {
                            name: "Singularity/",
                            tag: "Ground of the Machine: Kernel & Foreign IPC",
                            code: `// Foreign software and hardware live as channels
struct SingularityKernel {
    IPCSocketChannel remote_cuda;
    HardwareChannel real_sense_camera;
    PermissionGate authority_gate;
};`,
                            desc: "The interface to the physical computer. Foreign hardware (RealSense, JAKA manipulator) and remote CUDA GPU clusters connect as gated channels rather than polluting the core ontology."
                        },
                        vessel: {
                            name: "Vessel/",
                            tag: "C++20 Substrate · WebGPU Pipeline · WASM",
                            code: `// High-performance graphics and execution runtime
class VesselEngine {
    wgpu::Device webgpu_device;
    WasmRuntime wasm_instance;
    SATCollisionSolver sat_engine;
};`,
                            desc: "The modern rendering and execution runtime built on C++20, WebGPU (WGSL compute/render shaders), WebAssembly, and zero-allocation continuous physics."
                        }
                    };

                    const detailBox = document.getElementById("ontology-node-detail");
                    const buttons = container.querySelectorAll(".ontology-tree-btn");

                    function showNode(key) {
                        const n = nodeDetails[key] || nodeDetails.person;
                        detailBox.innerHTML = `
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <strong style="color:var(--gold);font-size:1.05rem;">${n.name}</strong>
                                <span style="color:var(--teal);font-size:0.78rem;">${n.tag}</span>
                            </div>
                            <p style="color:var(--ink);margin-bottom:12px;font-size:0.92rem;">${n.desc}</p>
                            <pre style="background:#09090b;padding:12px;border-radius:var(--radius-sm);color:#38bdf8;font-size:0.8rem;overflow-x:auto;border:1px solid var(--line);margin:0;"><code>${n.code}</code></pre>
                        `;
                    }

                    buttons.forEach(btn => {
                        btn.addEventListener("click", () => {
                            buttons.forEach(b => b.classList.remove("active"));
                            btn.classList.add("active");
                            showNode(btn.getAttribute("data-node"));
                        });
                    });

                    showNode("person");
                    return null;
                }
            },

            teacherops: {
                title: "TeacherOps — Human-in-the-Loop Operations",
                role: "Local FastAPI + SQLite · Operational Tutoring Hub",
                tag: "02.3 // Operational Tools & Workflow",
                github: "https://github.com/zhangzachary834-commits/teacherops",
                lead: "A local, air-gapped FastAPI and SQLite assistant for a family tutoring hub. Bridges automated inquiry matching with strict human-in-the-loop approval gates where automation stops and human discernment begins.",
                render: (container) => {
                    container.innerHTML = `
                        <div class="drawer-section">
                            <span class="drawer-section-title">Human-in-the-Loop Workflow Simulation</span>
                            <div class="drawer-sim-box">
                                <div class="drawer-sim-header">
                                    <div class="drawer-sim-controls">
                                        <button class="drawer-sim-btn active" id="tops-sim-btn">▶ Simulate Parent Inquiry Match</button>
                                        <button class="drawer-sim-btn" id="tops-reset-btn">Reset</button>
                                    </div>
                                    <span id="tops-status-badge" class="drawer-sim-status status-separated">HUMAN GATE: AWAITING INQUIRY</span>
                                </div>
                                <div id="tops-flow-container" style="display:flex;flex-direction:column;gap:10px;font-family:var(--font-mono);font-size:0.82rem;">
                                    <div style="padding:12px;border-radius:var(--radius-sm);background:rgba(0,0,0,0.3);border:1px solid var(--line);">
                                        <span style="color:var(--muted);">Incoming Parent Inquiry:</span>
                                        <div style="color:var(--ink);margin-top:4px;">"Looking for AP Calculus BC &amp; Physics C tutoring for sophomore student (Tuesdays/Thursdays)."</div>
                                    </div>
                                    <div id="tops-match-result" style="padding:12px;border-radius:var(--radius-sm);background:rgba(56,189,248,0.08);border:1px solid var(--teal);display:none;">
                                        <span style="color:var(--teal);">Scoring &amp; Match Matrix:</span>
                                        <div style="color:var(--gold);margin-top:4px;">1. Alex W. (Score: 98.4% · Subject: Math/Physics · Avail: Tue/Thu)</div>
                                        <div style="color:var(--muted);">2. Sarah K. (Score: 91.2% · Subject: Math · Avail: Tue)</div>
                                        <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--line);color:var(--ink);">
                                            <strong>Drafted Response:</strong> "Hi Mrs. Lin, I recommend Alex for AP Calc BC &amp; Physics C on Tuesdays at 4:30 PM..."
                                        </div>
                                    </div>
                                    <div id="tops-gate-action" style="display:none;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(216,180,110,0.1);border:1px solid var(--gold);border-radius:var(--radius-sm);">
                                        <span style="color:var(--gold);">⚡ Human Operator Action Required</span>
                                        <button class="btn btn-small btn-primary" id="tops-approve-btn">Approve &amp; Dispatch ✓</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">System Metrics &amp; Operational Benchmarks</span>
                            <div class="drawer-metrics-grid">
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">&lt; 2.5 ms</span>
                                    <span class="drawer-metric-label">FastAPI Query Latency</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">100% Local</span>
                                    <span class="drawer-metric-label">Air-Gapped SQLite DB</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">0 Telemetry</span>
                                    <span class="drawer-metric-label">Complete Privacy Invariant</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">Human Sovereign</span>
                                    <span class="drawer-metric-label">Zero Blind Automation</span>
                                </div>
                            </div>
                        </div>
                    `;

                    const simBtn = document.getElementById("tops-sim-btn");
                    const resetBtn = document.getElementById("tops-reset-btn");
                    const matchResult = document.getElementById("tops-match-result");
                    const gateAction = document.getElementById("tops-gate-action");
                    const approveBtn = document.getElementById("tops-approve-btn");
                    const statusBadge = document.getElementById("tops-status-badge");

                    simBtn.addEventListener("click", () => {
                        matchResult.style.display = "block";
                        gateAction.style.display = "flex";
                        statusBadge.className = "drawer-sim-status status-colliding";
                        statusBadge.textContent = "HUMAN GATE: APPROVAL PENDING";
                    });

                    approveBtn.addEventListener("click", () => {
                        gateAction.innerHTML = '<span style="color:#34d399;">✓ Message Approved by Operator &amp; Dispatched to Parent.</span>';
                        statusBadge.className = "drawer-sim-status status-separated";
                        statusBadge.textContent = "STATUS: DISPATCHED SUCCESSFULLY";
                    });

                    resetBtn.addEventListener("click", () => {
                        matchResult.style.display = "none";
                        gateAction.style.display = "none";
                        gateAction.innerHTML = `
                            <span style="color:var(--gold);">⚡ Human Operator Action Required</span>
                            <button class="btn btn-small btn-primary" id="tops-approve-btn">Approve &amp; Dispatch ✓</button>
                        `;
                        statusBadge.className = "drawer-sim-status status-separated";
                        statusBadge.textContent = "HUMAN GATE: AWAITING INQUIRY";
                    });

                    return null;
                }
            },

            bridge: {
                title: "Sandbox-to-Terminal Bridge",
                role: "macOS Host IPC · AI Agent Execution Bridge",
                tag: "02.4 // Developer Infrastructure",
                github: "https://github.com/zhangzachary834-commits",
                lead: "A bidirectional IPC bridge connecting isolated AI coding sandboxes with host execution, live Google Docs synchronization, and human-in-the-loop security verification.",
                render: (container) => {
                    container.innerHTML = `
                        <div class="drawer-section">
                            <span class="drawer-section-title">Bidirectional IPC Architecture</span>
                            <div class="drawer-sim-box">
                                <pre style="background:#09090b;padding:16px;border-radius:var(--radius-sm);color:#6ee7d8;font-family:var(--font-mono);font-size:0.82rem;line-height:1.5;overflow-x:auto;border:1px solid var(--line);margin:0;">
┌────────────────────────────────────────────────────────────────────────┐
│                        ISOLATED AGENT SANDBOX                          │
│     Autonomous coding subagents execute in constrained VM scope       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON-RPC IPC Socket
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     SANDBOX-TO-TERMINAL BRIDGE DAEMON                  │
│     • Request Ingestion &amp; Parameter Validation                         │
│     • Two-Way Google Docs Real-Time Note Synchronization               │
│     • Human Approval Verification Gate                                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Verified Execution
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          macOS HOST TERMINAL                           │
│     Executes verified builds, test suites, and hardware control loops  │
└────────────────────────────────────────────────────────────────────────┘</pre>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">System Metrics &amp; Protocols</span>
                            <div class="drawer-metrics-grid">
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">UNIX Socket / IPC</span>
                                    <span class="drawer-metric-label">Communication Protocol</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">GDoc Two-Way</span>
                                    <span class="drawer-metric-label">Real-Time Note Sync</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">macOS Native</span>
                                    <span class="drawer-metric-label">Host Environment</span>
                                </div>
                                <div class="drawer-metric-card">
                                    <span class="drawer-metric-val">Gated Auth</span>
                                    <span class="drawer-metric-label">Human Execution Boundary</span>
                                </div>
                            </div>
                        </div>
                    `;
                    return null;
                }
            },
            proofs: {
                title: "Substrate Derivations & Mathematical Proofs",
                role: "Linear Algebra · Convex Geometry · Rete Complexity",
                tag: "01.1 // Mathematical Substrates & Proofs",
                github: "https://github.com/zhangzachary834-commits/Earthcall",
                lead: "Formal mathematical formulations and analytical proofs underpinning Earthcall's spatial physics, robotics AprilTag calibration, and OntoMath law evaluation networks.",
                render: (container) => {
                    container.innerHTML = `
                        <div class="drawer-section">
                            <span class="drawer-section-title">Theorem 1: Continuous 3D Separating Axis Theorem (SAT)</span>
                            <div class="drawer-sim-box">
                                <p style="color:var(--ink);font-size:0.92rem;margin-bottom:8px;">
                                    <strong>Statement:</strong> Let $A, B \subset \mathbb{R}^3$ be two non-empty, compact, convex polyhedra. $A$ and $B$ are disjoint ($A \cap B = \emptyset$) if and only if there exists a unit vector $\hat{\mathbf{n}} \in \mathbb{S}^2$ such that:
                                </p>
                                <pre style="background:#09090b;padding:12px;border-radius:var(--radius-sm);color:#6ee7d8;font-family:var(--font-mono);font-size:0.82rem;margin:0;">$$\max_{\mathbf{x} \in A} (\mathbf{x} \cdot \hat{\mathbf{n}}) < \min_{\mathbf{y} \in B} (\mathbf{y} \cdot \hat{\mathbf{n}})$$</pre>
                                <p style="color:var(--muted);font-size:0.86rem;margin-top:8px;">
                                    <strong>Candidate Axis Space:</strong> For two 3D convex polyhedra with face normal sets $\mathcal{N}_A, \mathcal{N}_B$ and edge direction sets $\mathcal{E}_A, \mathcal{E}_B$, the complete set of candidate separating axes $\mathcal{U}$ is strictly:
                                </p>
                                <pre style="background:#09090b;padding:12px;border-radius:var(--radius-sm);color:#d8b46e;font-family:var(--font-mono);font-size:0.82rem;margin:0;">$$\mathcal{U} = \mathcal{N}_A \cup \mathcal{N}_B \cup \{ \mathbf{e}_A \times \mathbf{e}_B \mid \mathbf{e}_A \in \mathcal{E}_A, \mathbf{e}_B \in \mathcal{E}_B \}$$</pre>
                                <p style="color:var(--muted);font-size:0.85rem;margin-top:6px;">For Oriented Bounding Boxes (OBBs), $|\mathcal{U}| = 3 + 3 + 3 \times 3 = 15$ orthogonal tests, allowing SIMD vectorization.</p>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">Theorem 2: Rigid Body SE(3) AprilTag Frame Homography</span>
                            <div class="drawer-sim-box">
                                <p style="color:var(--ink);font-size:0.92rem;margin-bottom:8px;">
                                    <strong>Coordinate Frame Transform:</strong> Given camera optical frame $\{C\}$, AprilTag fiducial frame $\{T\}$, and JAKA manipulator base frame $\{B\}$, point transformation from camera frame $\mathbf{p}_C$ to robot base $\mathbf{p}_B$ is:
                                </p>
                                <pre style="background:#09090b;padding:12px;border-radius:var(--radius-sm);color:#38bdf8;font-family:var(--font-mono);font-size:0.82rem;margin:0;">$$\begin{bmatrix} \mathbf{p}_B \\ 1 \end{bmatrix} = T_T^B \cdot \left( T_C^T \right)^{-1} \cdot \begin{bmatrix} \mathbf{p}_C \\ 1 \end{bmatrix} = \begin{bmatrix} R_C^B & \mathbf{t}_C^B \\ \mathbf{0}^T & 1 \end{bmatrix} \begin{bmatrix} \mathbf{p}_C \\ 1 \end{bmatrix}$$</pre>
                                <p style="color:var(--muted);font-size:0.85rem;margin-top:6px;">where $R \in \mathrm{SO}(3)$ is recovered via Singular Value Decomposition (SVD) of the planar homography matrix $H \in \mathbb{R}^{3\times 3}$.</p>
                            </div>
                        </div>

                        <div class="drawer-section">
                            <span class="drawer-section-title">Theorem 3: Rete Network Memory Complexity for OntoMath</span>
                            <div class="drawer-sim-box">
                                <p style="color:var(--ink);font-size:0.92rem;margin-bottom:8px;">
                                    <strong>Token Propagation Bounds:</strong> For $N$ active constructed beings and $L$ runtime OntoMath laws with condition depth $d$, worst-case $\alpha$-memory search is $O(N)$ while beta-memory joins are bounded by $O(N^k)$ where $k$ is the maximum relational valence.
                                </p>
                                <p style="color:var(--muted);font-size:0.85rem;margin:0;">Earthcall bounds $k \le 2$ (binary relation laws), guaranteeing $O(N^2)$ relational propagation with spatial hash acceleration reducing average evaluation to $O(N \log N)$.</p>
                            </div>
                        </div>
                    `;
                    return null;
                }
            },

        };

        window.openProjectSpec = openProjectSpec;
        function openProjectSpec(key) {
            const spec = SPECS[key];
            if (!spec) return;

            if (currentSimCleanup) {
                currentSimCleanup();
                currentSimCleanup = null;
            }

            drawerTitle.textContent = spec.title;
            drawerRole.textContent = spec.role;
            const tagEl = drawerModal.querySelector(".drawer-tag");
            if (tagEl) tagEl.textContent = spec.tag;

            if (drawerGhLink) {
                if (spec.github) {
                    drawerGhLink.href = spec.github;
                    drawerGhLink.style.display = "inline-flex";
                } else {
                    drawerGhLink.style.display = "none";
                }
            }

            drawerBody.innerHTML = `
                <p class="drawer-lead-text">${spec.lead}</p>
                <div id="drawer-dynamic-content"></div>
            `;

            const dynamicContent = document.getElementById("drawer-dynamic-content");
            if (spec.render) {
                currentSimCleanup = spec.render(dynamicContent);
            }

            drawerModal.removeAttribute("hidden");
            drawerModal.offsetHeight;
            drawerModal.classList.add("open");
        }

        const urlParams = new URLSearchParams(window.location.search);
        const projParam = urlParams.get("project") || urlParams.get("spec");
        if (projParam && SPECS[projParam]) {
            setTimeout(() => openProjectSpec(projParam), 250);
        }
    }

    // =========================================================================
    // Résumé / CV Modal Controller
    // =========================================================================
    function initResumeModal() {
        const resumeModal = document.getElementById("resume-modal");
        const resumeCloseBtn = document.getElementById("resume-close-btn");
        const resumeBackdrop = document.getElementById("resume-backdrop");
        const heroResumeBtn = document.getElementById("hero-resume-btn");

        function openResume() {
            if (!resumeModal) return;
            resumeModal.removeAttribute("hidden");
            resumeModal.offsetHeight;
            resumeModal.classList.add("open");
        }

        function closeResume() {
            if (!resumeModal) return;
            resumeModal.classList.remove("open");
            setTimeout(() => resumeModal.setAttribute("hidden", ""), 320);
        }

        if (heroResumeBtn) heroResumeBtn.addEventListener("click", openResume);
        if (resumeCloseBtn) resumeCloseBtn.addEventListener("click", closeResume);
        if (resumeBackdrop) resumeBackdrop.addEventListener("click", closeResume);

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && resumeModal && resumeModal.classList.contains("open")) {
                closeResume();
            }
        });

        window.openResumeModal = openResume;
    }

    // =========================================================================
    // Global Command Palette Controller (Cmd + K / Ctrl + K)
    // =========================================================================
    function initCommandPalette() {
        const paletteModal = document.getElementById("palette-modal");
        const paletteInput = document.getElementById("palette-input");
        const paletteResults = document.getElementById("palette-results");
        const paletteBackdrop = document.getElementById("palette-backdrop");
        const paletteToggleBtn = document.getElementById("palette-toggle-btn");
        if (!paletteModal || !paletteInput || !paletteResults) return;

        const PALETTE_ACTIONS = [
            { icon: "⚡", title: "SAT Collision Physics Simulator", desc: "Launch 3D/2D continuous collision spec & sandbox", action: () => openProjectSpec("sat"), group: "Simulators & Specs" },
            { icon: "🦾", title: "JAKA Manipulator & VLA Pipeline", desc: "Kinematics & AprilTag calibration simulator", action: () => openProjectSpec("robotics"), group: "Simulators & Specs" },
            { icon: "✦", title: "Earthcall Substrate Architecture", desc: "Inspect Person-centered ontology tree", action: () => openProjectSpec("earthcall"), group: "Simulators & Specs" },
            { icon: "🏫", title: "TeacherOps Operational Assistant", desc: "FastAPI human-in-the-loop workflow simulation", action: () => openProjectSpec("teacherops"), group: "Simulators & Specs" },
            { icon: "🌉", title: "Sandbox-to-Terminal Bridge", desc: "Bidirectional agent execution & GDoc sync", action: () => openProjectSpec("bridge"), group: "Simulators & Specs" },
            { icon: "📐", title: "Substrate Mathematical Proofs", desc: "SAT, SE(3) pose homography & Rete bounds", action: () => openProjectSpec("proofs"), group: "Simulators & Specs" },
            { icon: "📄", title: "Curriculum Vitae / Résumé", desc: "Open print-ready academic résumé", action: () => window.openResumeModal && window.openResumeModal(), group: "Quick Actions" },
            { icon: ">_", title: "Interactive Terminal CLI", desc: "Toggle in-browser shell (press `)", action: () => openTerminal(), group: "Quick Actions" },
            { icon: "🚀", title: "Run Substrate Benchmark", desc: "Execute live Float32 MatMul & SAT tests", action: () => { openTerminal(); setTimeout(() => executeCommand("benchmark"), 100); }, group: "Quick Actions" },
            { icon: "🌗", title: "Toggle Theme", desc: "Switch between dark and light modes", action: () => COMMANDS.theme(), group: "Quick Actions" },
            { icon: "👤", title: "Switch to Personal Portfolio Mode", desc: "View engineering, robotics & systems", action: () => setSiteMode("personal"), group: "Navigation" },
            { icon: "✧", title: "Switch to Dimension of Thought Mode", desc: "View holistic narrative platform", action: () => setSiteMode("dimension"), group: "Navigation" },
            { icon: "📚", title: "The Library Archives", desc: "Browse essays & philosophical inquiries", action: () => { window.location.href = "library.html"; }, group: "Navigation" },
            { icon: "✍️", title: "Article Drafting Studio", desc: "Visual essay authoring workspace", action: () => { window.location.href = "studio.html"; }, group: "Navigation" }
        ];

        let selectedIdx = 0;
        let filteredActions = [...PALETTE_ACTIONS];

        function renderResults() {
            paletteResults.innerHTML = "";
            let currentGroup = "";
            filteredActions.forEach((item, idx) => {
                if (item.group !== currentGroup) {
                    currentGroup = item.group;
                    const gTitle = document.createElement("div");
                    gTitle.className = "palette-group-title";
                    gTitle.textContent = currentGroup;
                    paletteResults.appendChild(gTitle);
                }
                const row = document.createElement("div");
                row.className = `palette-item ${idx === selectedIdx ? "active" : ""}`;
                row.innerHTML = `
                    <div class="palette-item-left">
                        <span class="palette-item-icon">${item.icon}</span>
                        <span class="palette-item-text">${item.title}</span>
                    </div>
                    <span class="palette-item-desc">${item.desc}</span>
                `;
                row.addEventListener("click", () => {
                    closePalette();
                    item.action();
                });
                paletteResults.appendChild(row);
            });
            if (filteredActions.length === 0) {
                paletteResults.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);font-family:var(--font-mono);font-size:0.88rem;">No matching commands or specs found.</div>';
            }
        }

        function openPalette() {
            paletteModal.removeAttribute("hidden");
            paletteModal.classList.add("open");
            paletteInput.value = "";
            filteredActions = [...PALETTE_ACTIONS];
            selectedIdx = 0;
            renderResults();
            setTimeout(() => paletteInput.focus(), 40);
        }

        function closePalette() {
            paletteModal.classList.remove("open");
            setTimeout(() => paletteModal.setAttribute("hidden", ""), 200);
        }

        if (paletteToggleBtn) paletteToggleBtn.addEventListener("click", openPalette);
        if (paletteBackdrop) paletteBackdrop.addEventListener("click", closePalette);

        window.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (paletteModal.classList.contains("open")) closePalette();
                else openPalette();
            } else if (e.key === "Escape" && paletteModal.classList.contains("open")) {
                closePalette();
            }
        });

        paletteInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            filteredActions = PALETTE_ACTIONS.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.desc.toLowerCase().includes(query) ||
                item.group.toLowerCase().includes(query)
            );
            selectedIdx = 0;
            renderResults();
        });

        paletteInput.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") {
                selectedIdx = (selectedIdx + 1) % Math.max(1, filteredActions.length);
                renderResults();
                e.preventDefault();
            } else if (e.key === "ArrowUp") {
                selectedIdx = (selectedIdx - 1 + filteredActions.length) % Math.max(1, filteredActions.length);
                renderResults();
                e.preventDefault();
            } else if (e.key === "Enter" && filteredActions[selectedIdx]) {
                e.preventDefault();
                const chosen = filteredActions[selectedIdx];
                closePalette();
                chosen.action();
            }
        });

        window.openPalette = openPalette;
    }

    // -------------------------------------------------------------------------
    // Embedded OntoMath Law Evaluator Canvas Simulation
    // -------------------------------------------------------------------------
    function initOntoMathEvaluator() {
        const canvas = document.getElementById("ontomath-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const countBadge = document.getElementById("ontomath-being-count");
        const spawnBtn = document.getElementById("ontomath-spawn-btn");
        const resetBtn = document.getElementById("ontomath-reset-btn");
        const lawButtons = document.querySelectorAll("#ontomath-law-toggles [data-law]");

        const activeLaws = { gravity: true, resonance: true, damping: true };

        lawButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const law = btn.getAttribute("data-law");
                activeLaws[law] = !activeLaws[law];
                btn.classList.toggle("active", activeLaws[law]);
            });
        });

        let nodes = [
            { x: 180, y: 120, vx: 0.6, vy: -0.3, mass: 12, charge: 1.0, name: "Being:Alpha" },
            { x: 320, y: 160, vx: -0.4, vy: 0.5, mass: 16, charge: -1.0, name: "Being:Beta" },
            { x: 500, y: 100, vx: 0.3, vy: -0.4, mass: 14, charge: 1.0, name: "Being:Gamma" },
            { x: 420, y: 200, vx: -0.5, vy: -0.2, mass: 11, charge: -0.5, name: "Being:Delta" }
        ];

        let draggedNode = null;

        function updatePhysics() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.hypot(dx, dy) || 1;

                    if (activeLaws.gravity && dist > 20) {
                        const force = ((a.mass * b.mass) / (dist * dist)) * 0.09;
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;
                        a.vx += fx / a.mass;
                        a.vy += fy / a.mass;
                        b.vx -= fx / b.mass;
                        b.vy -= fy / b.mass;
                    }

                    if (activeLaws.resonance && dist < 140) {
                        const rep = (140 - dist) * 0.0035 * (a.charge * b.charge);
                        a.vx -= (dx / dist) * rep;
                        a.vy -= (dy / dist) * rep;
                        b.vx += (dx / dist) * rep;
                        b.vy += (dy / dist) * rep;
                    }
                }
            }

            nodes.forEach(n => {
                if (n === draggedNode) return;
                if (activeLaws.damping) {
                    n.vx *= 0.985;
                    n.vy *= 0.985;
                }
                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 35) { n.x = 35; n.vx *= -0.7; }
                if (n.x > canvas.width - 35) { n.x = canvas.width - 35; n.vx *= -0.7; }
                if (n.y < 35) { n.y = 35; n.vy *= -0.7; }
                if (n.y > canvas.height - 35) { n.y = canvas.height - 35; n.vy *= -0.7; }
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updatePhysics();

            // Background subtle grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += 30) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 30) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            // Law connection edges
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const dist = Math.hypot(b.x - a.x, b.y - a.y);
                    if (dist < 220) {
                        const alpha = (1 - dist / 220) * 0.45;
                        ctx.strokeStyle = `rgba(110, 231, 216, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();

                        // Midpoint property badge
                        const mx = (a.x + b.x) / 2;
                        const my = (a.y + b.y) / 2;
                        ctx.fillStyle = `rgba(216, 180, 110, ${alpha * 0.7})`;
                        ctx.fillRect(mx - 2, my - 2, 4, 4);
                    }
                }
            }

            // Draw Being Nodes
            nodes.forEach(n => {
                ctx.fillStyle = n.charge > 0 ? "rgba(216, 180, 110, 0.3)" : "rgba(110, 231, 216, 0.3)";
                ctx.strokeStyle = n.charge > 0 ? "#d8b46e" : "#6ee7d8";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.mass, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#fff";
                ctx.font = "10px monospace";
                ctx.fillText(n.name, n.x - 28, n.y - n.mass - 4);
            });

            requestAnimationFrame(draw);
        }

        canvas.addEventListener("mousedown", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            draggedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.mass + 8);
        });

        window.addEventListener("mousemove", (e) => {
            if (!draggedNode) return;
            const rect = canvas.getBoundingClientRect();
            draggedNode.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            draggedNode.y = (e.clientY - rect.top) * (canvas.height / rect.height);
            draggedNode.vx = 0;
            draggedNode.vy = 0;
        });

        window.addEventListener("mouseup", () => { draggedNode = null; });

        if (spawnBtn) {
            spawnBtn.addEventListener("click", () => {
                nodes.push({
                    x: Math.random() * (canvas.width - 100) + 50,
                    y: Math.random() * (canvas.height - 100) + 50,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    mass: Math.floor(Math.random() * 8) + 10,
                    charge: Math.random() > 0.5 ? 1.0 : -1.0,
                    name: `Being:${String.fromCharCode(65 + nodes.length)}`
                });
                if (countBadge) countBadge.textContent = `${nodes.length} Nodes`;
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                nodes = [
                    { x: 180, y: 120, vx: 0.6, vy: -0.3, mass: 12, charge: 1.0, name: "Being:Alpha" },
                    { x: 320, y: 160, vx: -0.4, vy: 0.5, mass: 16, charge: -1.0, name: "Being:Beta" },
                    { x: 500, y: 100, vx: 0.3, vy: -0.4, mass: 14, charge: 1.0, name: "Being:Gamma" },
                    { x: 420, y: 200, vx: -0.5, vy: -0.2, mass: 11, charge: -0.5, name: "Being:Delta" }
                ];
                if (countBadge) countBadge.textContent = `${nodes.length} Nodes`;
            });
        }

        draw();
    }

    initResumeModal();
    initCommandPalette();
    initOntoMathEvaluator();

    initLibraryConstellation();
});
