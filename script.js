/**
 * ============================================================================
 * Zachary Zhang // Dimension of Thought — Client Scripts
 * Multi-Mode Personal Portfolio & Holistic Platform
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
                hamburgerBtn.setAttribute("aria-expanded", "false");
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
    const essayFilterBtns = document.querySelectorAll(".essay-filter-btn");
    const essayCards = document.querySelectorAll(".essay-card");

    essayFilterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            essayFilterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");

            essayCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                const matches = filter === "all" || category === filter;
                card.style.display = matches ? "flex" : "none";
            });
        });
    });

    // -------------------------------------------------------------------------
    // Interactive Card Spotlight Hover Tracker
    // -------------------------------------------------------------------------
    const interactiveCards = document.querySelectorAll(
        ".stat-card, .now-card, .project-card, .pillar-card, .skill-category-card, .story-card, .manifesto-card, .essay-card, .initiative-card, .contact-item-card"
    );

    interactiveCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

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
        const count = Math.min(Math.floor(w / 18), 120); // Foreground stars

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

        // Add lots of very subtle background stars
        const bgCount = Math.min(Math.floor(w / 4), 500); 
        bgStars = [];
        for (let i = 0; i < bgCount; i++) {
            bgStars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.04, // Very slow
                vy: (Math.random() - 0.5) * 0.04,
                radius: Math.random() * 0.8 + 0.2, // Tiny
                twinkleSpeed: Math.random() * 0.015 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                colorIndex: i % 3 // 0: gold, 1: teal, 2: purple
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
                
                // Get existing hover stars
                let hoverStars = stars.filter(s => Math.hypot(s.x - mx, s.y - my) < 130);
                
                // Spawn 1-5 NEW temporary threads that reach further out!
                const rand = Math.random();
                let numStrands = 1;
                if (rand > 0.4) numStrands = 2; 
                if (rand > 0.7) numStrands = 3; 
                if (rand > 0.9) numStrands = 4; 
                if (rand > 0.97) numStrands = 5; 
                
                let potentialNew = stars.filter(s => {
                    let d = Math.hypot(s.x - mx, s.y - my);
                    return d >= 130 && d < 380; // Only stars outside hover radius
                }).sort(() => Math.random() - 0.5).slice(0, numStrands); // Random subset
                
                for (let s of potentialNew) {
                    window.extraTethers.push({ target: s, life: 1.0 }); // Temporary tether
                }
                
                // Pulse ALL connected threads (hover + new ones)
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
        const goldColor = isDark ? "rgba(216, 180, 110," : "rgba(242, 133, 41,"; // Vibrant Orange in light mode
        const tealColor = isDark ? "rgba(110, 231, 216," : "rgba(14, 153, 204,"; // Vibrant Sky Blue in light mode
        const purpleColor = isDark ? "rgba(168, 85, 247," : "rgba(224, 61, 137,"; // Vibrant Pink in light mode
        const labelColor = isDark ? "rgba(247, 243, 235, 0.6)" : "rgba(24, 21, 16, 0.6)";

        const cascadeStartHue = isDark ? 170 : 195; // Dark: Teal (170), Light: Sky Blue (195)
        const cascadeHueShift = isDark ? 8 : 10; // Dark shifts to Purple (290), Light shifts to Orange (345/360)
        const cascadeSat = isDark ? 85 : 90;
        const cascadeLit = isDark ? 65 : 52; // Lower lightness for light mode so it pops against white
        
        // Draw Dynamic Nebulae (blending)
        ctx.globalCompositeOperation = isDark ? "screen" : "multiply";
        for (const n of nebulae) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -n.r || n.x > w + n.r) n.vx *= -1;
            if (n.y < -n.r || n.y > h + n.r) n.vy *= -1;

            const baseColor = n.colorIndex === 0 ? goldColor : (n.colorIndex === 1 ? tealColor : purpleColor);
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
            grad.addColorStop(0, `${baseColor} 0.12)`);
            grad.addColorStop(1, `${baseColor} 0)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }
        ctx.globalCompositeOperation = "source-over";

        // Draw Background Stars
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
        // Spontaneous cascade ignition
        if (Math.random() < 0.003 && stars.length > 0) { // 0.3% chance per frame (~1 every 5 seconds)
            const randStar = stars[Math.floor(Math.random() * stars.length)];
            if (randStar.pulseState === 0) {
                randStar.pulseTarget = Math.random() * 0.5 + 0.5; // Random max intensity
                randStar.pulseEnergy = 0.05;
                randStar.pulseState = 1; // 1 = rising
                randStar.pulseJumps = Math.floor(Math.random() * 12) + 4; // Cascade 4 to 15 times
                randStar.pulseHue = cascadeStartHue; // Theme-aware starting hue
            }
        }

        // Move stars
        for (const s of stars) {
            // Smooth pulse transitions
            if (s.pulseState === 1) {
                s.pulseEnergy += 0.04; // Deliberate smooth rise
                if (s.pulseEnergy >= s.pulseTarget) {
                    s.pulseEnergy = s.pulseTarget;
                    s.pulseState = 2; // start decaying
                }
            } else if (s.pulseState === 2) {
                s.pulseEnergy -= 0.008; // Smooth slow decay
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

        // Draw Folding Lines (Dynamic Bezier Curves)
        for (let i = 0; i < stars.length; i++) {
            // Check ALL remaining stars to build a complete dense network
            for (let j = i + 1; j < stars.length; j++) {
                const a = stars[i];
                const b = stars[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                const maxDist = w > 768 ? 160 : 100;
                
                if (dist < maxDist) {
                    let cascadeAlpha = 0;
                    
                    // Propagate Cascade Signal
                    if (a.pulseState !== 0 || b.pulseState !== 0) {
                        cascadeAlpha = Math.max(a.pulseEnergy, b.pulseEnergy);
                        
                        // Pass the signal forward once it's brightly glowing to create a slight delay
                        if (a.pulseEnergy > 0.5 && a.pulseJumps > 0 && b.pulseState === 0) {
                            if (Math.random() < 0.08) { // 8% chance per frame once charged
                                b.pulseTarget = Math.random() * 0.4 + 0.6; // random peak 0.6 to 1.0
                                b.pulseEnergy = 0.05;
                                b.pulseState = 1;
                                b.pulseJumps = a.pulseJumps - 1;
                                b.pulseHue = (a.pulseHue + cascadeHueShift) % 360; // Theme-aware shift
                                // Drastically reduce A's remaining jumps to prevent an exponential nuclear chain explosion!
                                a.pulseJumps = Math.floor(a.pulseJumps / 2.5); 
                            }
                        } else if (b.pulseEnergy > 0.5 && b.pulseJumps > 0 && a.pulseState === 0) {
                            if (Math.random() < 0.08) {
                                a.pulseTarget = Math.random() * 0.4 + 0.6;
                                a.pulseEnergy = 0.05;
                                a.pulseState = 1;
                                a.pulseJumps = b.pulseJumps - 1;
                                a.pulseHue = (b.pulseHue + cascadeHueShift) % 360; // Theme-aware shift
                                b.pulseJumps = Math.floor(b.pulseJumps / 2.5);
                            }
                        }
                    }

                    // Organic pulsing so connections appear and disappear on their own over time
                    const organicFade = Math.sin(time * 0.006 + a.orbitOffset + b.orbitOffset) * 0.5 + 0.5;
                    const baseAlpha = (1 - dist / maxDist) * 0.45;
                    let alpha = baseAlpha * organicFade;
                    
                    // Cascade flash dramatically boosts visibility
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
                    
                        // Folding effect by dynamically moving control point
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

        // Draw Connections to Cursor
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
                        if (dist >= 130) { // Only add if it's outside the standard hover range
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
                    // Temporary extra tethers rely entirely on life instead of distance
                    baseAlpha = 0.4 * t.alphaMultiplier;
                    baseThickness = 1.0 + t.alphaMultiplier;
                }
                
                const starColorMatch = s.isTeal ? tealColor : (s.isPurple ? purpleColor : goldColor);
                
                // --- 1. Draw Normal Hover Line ---
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

                // --- 2. Draw Pulse Overlay ---
                let activePulse = window.cursorPulses ? window.cursorPulses.find(p => p.target === s) : null;
                
                if (activePulse) {
                    let cp = activePulse.progress;
                    // Fades slowly after reaching the star (progress > 1.0)
                    let fade = cp > 1.0 ? Math.max(0, 1.0 - (cp - 1.0) / 1.5) : 1.0;

                    if (fade > 0) {
                        const pulseBaseAlpha = Math.min(1.0, baseAlpha + 0.3);
                        const pulseGrad = ctx.createLinearGradient(mousePos.x, mousePos.y, s.x, s.y);
                        
                        const safeStop = (offset, color) => pulseGrad.addColorStop(Math.max(0, Math.min(1, offset)), color);

                        safeStop(0, `hsla(180, 100%, 70%, 0)`);
                        
                        // The traveling wave: Cyan -> Blue -> Violet -> Purple
                        safeStop(cp - 0.45, `hsla(180, 100%, 70%, ${pulseBaseAlpha * 0.4})`); // Cyan Tail
                        safeStop(cp - 0.15, `hsla(220, 100%, 75%, ${Math.min(1.0, pulseBaseAlpha * 1.5)})`); // Blue Mid
                        safeStop(cp + 0.05, `hsla(260, 100%, 85%, 1)`); // Violet Core
                        safeStop(cp + 0.35, `hsla(280, 100%, 70%, ${pulseBaseAlpha * 0.4})`); // Purple Head

                        safeStop(1, `hsla(280, 100%, 70%, 0)`);

                        ctx.strokeStyle = pulseGrad;
                        ctx.beginPath();
                        ctx.moveTo(mousePos.x, mousePos.y);
                        ctx.lineTo(s.x, s.y);

                        // Pulse causes the strand to physically bulge
                        let thicknessBulge = Math.sin(Math.min(1, cp) * Math.PI) * 3.0;
                        
                        ctx.lineWidth = baseThickness * 3.0 + thicknessBulge;
                        ctx.globalAlpha = 0.3 * fade;
                        ctx.stroke();

                        ctx.lineWidth = baseThickness * 0.8 + (thicknessBulge * 0.4);
                        ctx.globalAlpha = 1.0 * fade;
                        ctx.stroke();
                        
                        ctx.globalAlpha = 1.0; // Reset
                    }
                }
            }
        }

        // Draw Stars (Blinking & Shining)
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
            ctx.shadowBlur = 0; // Reset

            if (s.label && w > 800) {
                ctx.fillStyle = labelColor;
                ctx.fillText(s.label, s.x + 8, s.y - 8);
            }
        }
        // Update Traveling Cursor Pulses (like blood pumping through veins)
        if (window.cursorPulses) {
            for (let i = window.cursorPulses.length - 1; i >= 0; i--) {
                let p = window.cursorPulses[i];
                p.progress += p.speed;
                
                if (p.progress >= 1.0 && !p.ignited) {
                    // Ignite the target star ONCE
                    p.ignited = true;
                    p.target.pulseTarget = 1.0;
                    p.target.pulseEnergy = 0.5;
                    p.target.pulseState = 1;
                    p.target.pulseJumps = Math.floor(Math.random() * 12) + 6;
                    p.target.pulseHue = cascadeStartHue; // Starts cascade natively
                }
                
                if (p.progress >= 2.5) { // Keeps pulse alive for slow fading
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
            } catch {
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
                "mode <name>  — switch mode ('mode personal' or 'mode dimension')",
                "earthcall    — computational ontology in C++20/WebGPU",
                "projects     — view selected systems, robotics, and tools",
                "about        — Zachary Zhang bio and system principles",
                "dimension    — Dimension of Thought vision & purpose",
                "essays       — list all available essays in the Library",
                "read <id>    — open an essay (e.g. 'read persons', 'read valley')",
                "manifesto    — core philosophy & holistic continuum",
                "story        — origin story & building in public",
                "writers      — Writers of Light community service",
                "whoami       — about Zachary Zhang",
                "contact      — email, github, linkedin",
                "theme        — toggle dark / light mode",
                "clear        — clear terminal screen",
                "exit         — close terminal"
            ].forEach((line) => print("  " + line));
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
});
