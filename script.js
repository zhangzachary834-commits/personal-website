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
    // Essay Category Filtering (The Library Page)
    // -------------------------------------------------------------------------
    function initEssayFilters() {
        const essayFilterBtns = document.querySelectorAll(".essay-filter-btn");

        essayFilterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                essayFilterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.getAttribute("data-filter");

                const cards = document.querySelectorAll(".essay-card");
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

    function openTerminal() {
        if (!terminalModal) return;
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
            }
        });
    }

    const COMMANDS = {
        help: () => {
            print("✧ Available Commands:", "term-cmd-highlight");
            [
                "draft / studio — open Wix-like Article Drafting Studio",
                "drafts         — list saved drafts stored in browser",
                "mode <name>    — switch mode ('mode personal' or 'mode dimension')",
                "earthcall      — computational ontology in C++20/WebGPU",
                "projects       — view selected systems, robotics, and tools",
                "about          — Zachary Zhang bio and system principles",
                "dimension      — Dimension of Thought vision & purpose",
                "essays         — list all available essays in the Library",
                "read <id>      — open an essay (e.g. 'read persons', 'read valley')",
                "manifesto      — core philosophy & holistic continuum",
                "story          — origin story & building in public",
                "writers        — Writers of Light community service",
                "whoami         — about Zachary Zhang",
                "contact        — email, github, linkedin",
                "theme          — toggle dark / light mode",
                "clear          — clear terminal screen",
                "exit           — close terminal"
            ].forEach((line) => print("  " + line));
        },
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
                print("Switched to Zachary Zhang's Personal Portfolio Mode", "term-cmd-highlight");
            } else if (m === "dimension" || m === "thought") {
                setSiteMode("dimension");
                print("Switched to Dimension of Thought Platform Mode", "term-cmd-highlight");
            } else {
                const cur = localStorage.getItem("dimension-site-mode") || "personal";
                const next = cur === "personal" ? "dimension" : "personal";
                setSiteMode(next);
                print(`Switched mode to ${next}`, "term-cmd-highlight");
            }
        },
        personal: () => {
            setSiteMode("personal");
            print("Switched to Zachary Zhang's Personal Portfolio", "term-cmd-highlight");
        },
        dimension: () => {
            setSiteMode("dimension");
            print("Switched to Dimension of Thought Platform", "term-cmd-highlight");
        },
        earthcall: () => {
            print("Earthcall Substrate", "term-cmd-highlight");
            print("Person-centered computational ontology with a C++20/WebGPU vessel.");
            print("Repository: https://github.com/zhangzachary834-commits/Earthcall");
        },
        projects: () => {
            print("Selected Projects:", "term-cmd-highlight");
            print("1. Earthcall (C++20, WebGPU, WASM, Rete Laws)");
            print("2. Vision Pipeline & JAKA Arm (OpenVLA-OFT, RealSense, AprilTag)");
            print("3. SAT Physics & Continuous Collision Engine (C++20)");
            print("4. TeacherOps (FastAPI, SQLite family tutoring platform)");
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
            print("4. sadako        — Justice Does Not Rejoice in Horror");
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
                "4": "posts/justice-horror-sadako.html",
                "sadako": "posts/justice-horror-sadako.html",
                "horror": "posts/justice-horror-sadako.html",
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
            const targetUrl = map[arg.toLowerCase()];
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
        clear: () => {
            terminalOutput.innerHTML = "";
        },
        exit: () => closeTerminal()
    };

    function executeCommand(cmdStr) {
        print(`guest@dimension:~$ ${cmdStr}`, "term-prompt-echo");
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
});

// =========================================================================
// Experimental Constellation View (Force-Directed Graph)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggle-graph-view-btn");
    const graphContainer = document.getElementById("graph-view-container");
    const gridContainer = document.getElementById("essays-grid");
    const canvas = document.getElementById("library-graph-canvas");
    const tooltip = document.getElementById("graph-tooltip");
    
    if (!toggleBtn || !graphContainer || !gridContainer || !canvas) return;

    let isGraphView = false;
    let animationId = null;
    let nodes = [];
    let edges = [];
    let hoveredNode = null;
    const ctx = canvas.getContext("2d");
    
    // Category Colors
    const colorMap = {
        ontology: "#c084fc",
        narrative: "#f87171",
        reflections: "#4ade80",
        systems: "#60a5fa",
        robotics: "#facc15"
    };

    function initGraphData() {
        nodes = [];
        edges = [];
        
        const categoryHubs = {};
        const conceptHubs = {};
        const cards = document.querySelectorAll(".essay-card");
        
        // Create nodes for each article
        cards.forEach(card => {
            const titleEl = card.querySelector(".essay-title a");
            if (!titleEl) return;
            const title = titleEl.textContent;
            const url = titleEl.getAttribute("href");
            const category = card.getAttribute("data-category") || "ontology";
            
            const node = {
                id: "art_" + title,
                isHub: false,
                isConcept: false,
                title: title,
                url: url,
                category: category,
                color: colorMap[category] || "#ffffff",
                radius: 6,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 0,
                vy: 0,
                orbitOffset: Math.random() * Math.PI * 2,
                twinkleOffset: Math.random() * Math.PI * 2
            };
            nodes.push(node);
            
            // Create category hub if not exists
            if (!categoryHubs[category]) {
                const hub = {
                    id: "hub_" + category,
                    isHub: true,
                    isConcept: false,
                    title: category.charAt(0).toUpperCase() + category.slice(1),
                    url: null,
                    category: category,
                    color: colorMap[category] || "#ffffff",
                    radius: 12,
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: 0,
                    vy: 0,
                    orbitOffset: Math.random() * Math.PI * 2,
                    twinkleOffset: Math.random() * Math.PI * 2
                };
                categoryHubs[category] = hub;
                nodes.push(hub);
            }
            
            // Edge from article to hub
            edges.push({
                source: node,
                target: categoryHubs[category]
            });
            
            // Process bidirectional concepts
            const conceptsAttr = card.getAttribute("data-concepts");
            if (conceptsAttr) {
                const concepts = conceptsAttr.split(",").map(c => c.trim()).filter(c => c);
                concepts.forEach(concept => {
                    if (!conceptHubs[concept]) {
                        const conceptNode = {
                            id: "concept_" + concept,
                            isHub: false,
                            isConcept: true,
                            title: "[[" + concept + "]]",
                            url: null,
                            category: "concept",
                            color: "#e2e8f0", // Light gray/silver for concepts
                            radius: 8,
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            vx: 0,
                            vy: 0,
                            orbitOffset: Math.random() * Math.PI * 2,
                            twinkleOffset: Math.random() * Math.PI * 2
                        };
                        conceptHubs[concept] = conceptNode;
                        nodes.push(conceptNode);
                    }
                    
                    // Edge from article to concept
                    edges.push({
                        source: node,
                        target: conceptHubs[concept]
                    });
                });
            }
        });
    }

    function resizeCanvas() {
        const rect = graphContainer.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const time = Date.now() * 0.001;
        
        // Draw edges
        edges.forEach(edge => {
            const a = edge.source;
            const b = edge.target;
            const dist = Math.hypot(b.x - a.x, b.y - a.y);
            
            const organicFade = Math.sin(time * 3 + a.orbitOffset + b.orbitOffset) * 0.3 + 0.7;
            let alpha = Math.max(0.05, 1 - (dist / 400)) * organicFade;
            
            if (hoveredNode && (a === hoveredNode || b === hoveredNode)) {
                alpha = 0.9;
                ctx.lineWidth = 1.6;
                const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                grad.addColorStop(0, a.color);
                grad.addColorStop(1, b.color);
                ctx.strokeStyle = grad;
            } else {
                ctx.lineWidth = 1.0;
                // Add color tint from target hub if available
                if (b.isHub) {
                    // Extract rgb from hex color for rgba (simplification, assuming hex)
                    // Just fallback to generic goldish/white glow
                    ctx.strokeStyle = `rgba(216, 180, 110, ${alpha * 0.4})`;
                } else {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
                }
            }
            
            const cx = (a.x + b.x) / 2 + Math.sin(time * 2 + a.orbitOffset) * 35;
            const cy = (a.y + b.y) / 2 + Math.cos(time * 2 + b.orbitOffset) * 35;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(cx, cy, b.x, b.y);
            ctx.stroke();
        });
        
        // Draw nodes
        nodes.forEach(node => {
            const blink = Math.sin(time * 4 + node.twinkleOffset) * 0.5 + 0.5;
            const currentRadius = node.isHub ? node.radius + (Math.sin(time*2)*1.5) : node.radius * (0.6 + blink * 0.4);
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
            
            // Add slight transparency based on blink for non-hubs
            if (node.isHub) {
                ctx.fillStyle = node.color;
            } else {
                // If it's hovered, make it fully opaque
                ctx.fillStyle = (node === hoveredNode) ? node.color : node.color + "99"; 
            }
            ctx.fill();
            
            if (node.isHub) {
                ctx.shadowBlur = 15 + blink * 5;
                ctx.shadowColor = node.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (node === hoveredNode) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = node.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            if (node === hoveredNode || node.isHub) {
                ctx.fillStyle = "rgba(247, 243, 235, 0.85)";
                ctx.font = node.isHub ? "500 14px 'IBM Plex Mono', monospace" : "12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(node.title, node.x, node.y + node.radius + 15);
            }
        });
    }

    function simulate() {
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);
        const center = { x: width / 2, y: height / 2 };
        
        const k = 0.05; // Spring constant
        const damping = 0.85;
        const repulsion = 2000;
        
        // Spring forces
        edges.forEach(edge => {
            const dx = edge.target.x - edge.source.x;
            const dy = edge.target.y - edge.source.y;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            const targetDist = edge.source.isHub || edge.target.isHub ? 120 : 180;
            const force = (dist - targetDist) * k;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            edge.source.vx += fx;
            edge.source.vy += fy;
            edge.target.vx -= fx;
            edge.target.vy -= fy;
        });
        
        // Repulsion forces
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const distSq = dx*dx + dy*dy || 1;
                if (distSq < 40000) {
                    const force = repulsion / distSq;
                    const dist = Math.sqrt(distSq);
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    n1.vx -= fx;
                    n1.vy -= fy;
                    n2.vx += fx;
                    n2.vy += fy;
                }
            }
            
            // Centering force
            const dx = center.x - nodes[i].x;
            const dy = center.y - nodes[i].y;
            nodes[i].vx += dx * 0.001;
            nodes[i].vy += dy * 0.001;
        }
        
        // Apply velocity
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.vx *= damping;
            node.vy *= damping;
            
            // Bounds
            if (node.x < 20) { node.x = 20; node.vx *= -1; }
            if (node.x > width - 20) { node.x = width - 20; node.vx *= -1; }
            if (node.y < 20) { node.y = 20; node.vy *= -1; }
            if (node.y > height - 20) { node.y = height - 20; node.vy *= -1; }
        });
    }

    function loop() {
        if (!isGraphView) return;
        simulate();
        draw();
        animationId = requestAnimationFrame(loop);
    }
    
    // Interactions
    let isDragging = false;
    let dragNode = null;
    
    canvas.addEventListener("mousemove", (e) => {
        if (!isGraphView) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (isDragging && dragNode) {
            dragNode.x = x;
            dragNode.y = y;
            dragNode.vx = 0;
            dragNode.vy = 0;
            return;
        }
        
        hoveredNode = null;
        let minDist = 20;
        
        nodes.forEach(node => {
            const dist = Math.hypot(node.x - x, node.y - y);
            if (dist < minDist) {
                minDist = dist;
                hoveredNode = node;
            }
        });
        
        if (hoveredNode) {
            canvas.style.cursor = "pointer";
            if (!hoveredNode.isHub) {
                tooltip.style.display = "block";
                tooltip.style.left = (e.clientX + 15) + "px";
                tooltip.style.top = (e.clientY + 15) + "px";
                tooltip.innerHTML = `<strong style="color:var(--gold);">${hoveredNode.title}</strong><br><span style="font-size:0.8rem;color:var(--muted);">${hoveredNode.category}</span>`;
            } else {
                tooltip.style.display = "none";
            }
        } else {
            canvas.style.cursor = "default";
            tooltip.style.display = "none";
        }
    });

    canvas.addEventListener("mousedown", (e) => {
        if (hoveredNode) {
            isDragging = true;
            dragNode = hoveredNode;
        }
    });
    
    window.addEventListener("mouseup", () => {
        isDragging = false;
        dragNode = null;
    });
    
    canvas.addEventListener("click", () => {
        if (hoveredNode && !hoveredNode.isHub && hoveredNode.url) {
            window.location.href = hoveredNode.url;
        }
    });

    toggleBtn.addEventListener("click", () => {
        isGraphView = !isGraphView;
        if (isGraphView) {
            toggleBtn.textContent = "📑 Grid View";
            toggleBtn.style.color = "var(--ink)";
            toggleBtn.style.borderColor = "var(--line)";
            gridContainer.style.display = "none";
            graphContainer.style.display = "block";
            resizeCanvas();
            initGraphData();
            loop();
        } else {
            toggleBtn.textContent = "🌌 Constellation View";
            toggleBtn.style.color = "var(--teal)";
            toggleBtn.style.borderColor = "var(--teal)";
            gridContainer.style.display = "grid";
            graphContainer.style.display = "none";
            cancelAnimationFrame(animationId);
            tooltip.style.display = "none";
        }
    });
    
    window.addEventListener("resize", () => {
        if (isGraphView) resizeCanvas();
    });
});
