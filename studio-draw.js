(() => {
    "use strict";

    const personWorkspace = window.DimensionPersonWorkspace || null;
    const WIDTH = 1600;
    const HEIGHT = 1000;
    const byId = (id) => document.getElementById(id);
    const SHAPE_TOOLS = new Set(["line", "rectangle", "ellipse"]);
    const DRAWABLE_TOOLS = new Set(["brush", "eraser", "line", "rectangle", "ellipse"]);
    const DRAW_TOOL_NAMES = new Set(["brush", "eraser", "line", "rectangle", "ellipse", "eyedropper", "pan"]);

    function init() {
        const articleWorkspace = byId("studio-workspace");
        const drawWorkspace = byId("draw-studio-workspace");
        const writeModeBtn = byId("studio-write-mode-btn");
        const drawModeBtn = byId("studio-draw-mode-btn");
        const drawNavCenter = byId("draw-nav-center");
        const brandGlyph = document.querySelector(".studio-brand-glyph");
        const brandText = document.querySelector(".studio-brand-text");
        const canvas = byId("draw-canvas");
        const stage = byId("draw-stage");
        const artboard = byId("draw-artboard");
        const cursor = byId("draw-brush-cursor");

        if (!articleWorkspace || !drawWorkspace || !writeModeBtn || !drawModeBtn || !canvas || !stage || !artboard || !cursor) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const colorInput = byId("draw-color");
        const sizeInput = byId("draw-size");
        const opacityInput = byId("draw-opacity");
        const paperInput = byId("draw-paper-color");
        const sizeValue = byId("draw-size-value");
        const opacityValue = byId("draw-opacity-value");
        const toolReadout = byId("draw-tool-readout");
        const zoomReadout = byId("draw-zoom-readout");
        const strokeReadout = byId("draw-stroke-readout");
        const brushPreview = byId("draw-brush-preview-dot");
        const brushSummary = byId("draw-brush-summary");
        const undoBtn = byId("draw-undo-btn");
        const redoBtn = byId("draw-redo-btn");
        const gridBtn = byId("draw-grid-btn");
        const clearBtn = byId("draw-clear-btn");
        const saveBtn = byId("draw-save-btn");
        const exportBtn = byId("draw-export-btn");
        const zoomInBtn = byId("draw-zoom-in-btn");
        const zoomOutBtn = byId("draw-zoom-out-btn");
        const zoomResetBtn = byId("draw-zoom-reset-btn");
        const resetViewBtn = byId("draw-reset-view-btn");
        const saveNote = byId("draw-save-note");
        const drawNavStatusText = byId("draw-nav-status-text");

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const state = {
            tool: "brush",
            color: colorInput ? colorInput.value : "#d8b46e",
            size: Number(sizeInput ? sizeInput.value : 12),
            opacity: Number(opacityInput ? opacityInput.value : 0.92),
            paper: paperInput ? paperInput.value : "#11131c",
            zoom: 0.82,
            panX: 0,
            panY: 0,
            strokes: [],
            redo: [],
            currentStroke: null,
            drawing: false,
            panning: false,
            pointerId: null,
            panStartX: 0,
            panStartY: 0,
            panOriginX: 0,
            panOriginY: 0,
            grid: false,
            clearTimer: null,
            saveTimer: null
        };

        function setMode(mode, persist) {
            const shouldPersist = persist !== false;
            const draw = mode === "draw";
            articleWorkspace.hidden = draw;
            drawWorkspace.hidden = !draw;
            writeModeBtn.classList.toggle("active", !draw);
            drawModeBtn.classList.toggle("active", draw);
            writeModeBtn.setAttribute("aria-selected", String(!draw));
            drawModeBtn.setAttribute("aria-selected", String(draw));
            document.body.classList.toggle("studio-mode-draw", draw);
            if (drawNavCenter) drawNavCenter.hidden = !draw;

            if (brandGlyph) brandGlyph.textContent = draw ? "🎨" : "✍️";
            if (brandText) brandText.textContent = draw ? "Art Studio" : "Article Studio";
            document.title = draw ? "2D Art Studio — Dimension of Thought" : "Article Drafting Studio — Dimension of Thought";

            if (shouldPersist && personWorkspace && personWorkspace.setStudioMode) {
                personWorkspace.setStudioMode(draw ? "draw" : "write");
            }

            if (draw) {
                requestAnimationFrame(() => {
                    applyViewTransform();
                    render();
                });
            }
        }

        writeModeBtn.addEventListener("click", () => setMode("write"));
        drawModeBtn.addEventListener("click", () => setMode("draw"));

        // ⚡ Bolt Optimization: Cache bounding rects during drag/hover
        // to prevent synchronous layout thrashing in high-frequency pointer events.
        let cachedCanvasRect = null;
        let cachedStageRect = null;
        window.addEventListener("scroll", () => {
            cachedCanvasRect = null;
            cachedStageRect = null;
        }, { passive: true });
        window.addEventListener("resize", () => {
            cachedCanvasRect = null;
            cachedStageRect = null;
        }, { passive: true });

        function normalizePoint(e) {
            const rect = cachedCanvasRect || canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return null;
            return {
                x: Math.max(0, Math.min(WIDTH, (e.clientX - rect.left) * WIDTH / rect.width)),
                y: Math.max(0, Math.min(HEIGHT, (e.clientY - rect.top) * HEIGHT / rect.height))
            };
        }

        function drawStroke(target, stroke) {
            const pts = stroke.points;
            if (!pts || !pts.length) return;

            target.save();
            target.globalAlpha = stroke.opacity;
            target.globalCompositeOperation = stroke.tool === "eraser" ? "destination-out" : "source-over";
            target.strokeStyle = stroke.color;
            target.fillStyle = stroke.color;
            target.lineWidth = stroke.size;
            target.lineCap = "round";
            target.lineJoin = "round";

            if (SHAPE_TOOLS.has(stroke.tool)) {
                if (pts.length < 2) {
                    target.restore();
                    return;
                }

                const first = pts[0];
                const last = pts[pts.length - 1];
                target.beginPath();

                if (stroke.tool === "line") {
                    target.moveTo(first.x, first.y);
                    target.lineTo(last.x, last.y);
                } else if (stroke.tool === "rectangle") {
                    target.rect(first.x, first.y, last.x - first.x, last.y - first.y);
                } else {
                    const centerX = (first.x + last.x) / 2;
                    const centerY = (first.y + last.y) / 2;
                    const radiusX = Math.abs(last.x - first.x) / 2;
                    const radiusY = Math.abs(last.y - first.y) / 2;
                    if (radiusX > 0 || radiusY > 0) {
                        target.ellipse(centerX, centerY, Math.max(.01, radiusX), Math.max(.01, radiusY), 0, 0, Math.PI * 2);
                    }
                }

                target.stroke();
                target.restore();
                return;
            }

            if (pts.length === 1) {
                target.beginPath();
                target.arc(pts[0].x, pts[0].y, stroke.size / 2, 0, Math.PI * 2);
                target.fill();
                target.restore();
                return;
            }

            target.beginPath();
            target.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length - 1; i++) {
                const midX = (pts[i].x + pts[i + 1].x) / 2;
                const midY = (pts[i].y + pts[i + 1].y) / 2;
                target.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
            }
            const last = pts[pts.length - 1];
            target.lineTo(last.x, last.y);
            target.stroke();
            target.restore();
        }

        function render() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            state.strokes.forEach((stroke) => drawStroke(ctx, stroke));
            if (state.currentStroke) drawStroke(ctx, state.currentStroke);
            updateUI();
        }

        function constrainShapePoint(start, point, tool, shiftKey) {
            if (!shiftKey) return point;

            const dx = point.x - start.x;
            const dy = point.y - start.y;

            if (tool === "line") {
                const distance = Math.hypot(dx, dy);
                if (!distance) return point;
                const angleStep = Math.PI / 4;
                const angle = Math.round(Math.atan2(dy, dx) / angleStep) * angleStep;
                return {
                    x: start.x + Math.cos(angle) * distance,
                    y: start.y + Math.sin(angle) * distance
                };
            }

            const side = Math.max(Math.abs(dx), Math.abs(dy));
            return {
                x: start.x + (dx < 0 ? -side : side),
                y: start.y + (dy < 0 ? -side : side)
            };
        }

        function parseHexColor(value) {
            const match = /^#([0-9a-f]{6})$/i.exec(value || "");
            if (!match) return { r: 17, g: 19, b: 28 };
            return {
                r: parseInt(match[1].slice(0, 2), 16),
                g: parseInt(match[1].slice(2, 4), 16),
                b: parseInt(match[1].slice(4, 6), 16)
            };
        }

        function rgbToHex(r, g, b) {
            const channel = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
            return "#" + channel(r) + channel(g) + channel(b);
        }

        function sampleColorAt(point) {
            const x = Math.max(0, Math.min(WIDTH - 1, Math.floor(point.x)));
            const y = Math.max(0, Math.min(HEIGHT - 1, Math.floor(point.y)));
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const paper = parseHexColor(state.paper);
            const alpha = pixel[3] / 255;

            state.color = rgbToHex(
                pixel[0] * alpha + paper.r * (1 - alpha),
                pixel[1] * alpha + paper.g * (1 - alpha),
                pixel[2] * alpha + paper.b * (1 - alpha)
            );

            if (colorInput) colorInput.value = state.color;
            syncSwatches();
            updateBrushPreview();
            setSavedStatus("Sampled " + state.color.toUpperCase(), false);
        }

        function startStroke(e) {
            if (state.tool === "pan" || e.button !== 0) return;
            cachedCanvasRect = canvas.getBoundingClientRect();
            const point = normalizePoint(e);
            if (!point) return;

            if (state.tool === "eyedropper" || e.altKey) {
                sampleColorAt(point);
                cachedCanvasRect = null;
                return;
            }

            if (!DRAWABLE_TOOLS.has(state.tool)) return;

            state.pointerId = e.pointerId;
            state.drawing = true;
            state.currentStroke = {
                tool: state.tool,
                color: state.color,
                size: state.size,
                opacity: state.opacity,
                points: SHAPE_TOOLS.has(state.tool) ? [point, point] : [point]
            };
            if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
            render();
        }

        function moveStroke(e) {
            if (!state.drawing || state.pointerId !== e.pointerId || !state.currentStroke) return;
            const point = normalizePoint(e);
            if (!point) return;
            const pts = state.currentStroke.points;

            if (SHAPE_TOOLS.has(state.currentStroke.tool)) {
                pts[1] = constrainShapePoint(pts[0], point, state.currentStroke.tool, e.shiftKey);
                render();
                return;
            }

            const last = pts[pts.length - 1];
            const dx = point.x - last.x;
            const dy = point.y - last.y;
            if (dx * dx + dy * dy < 2.2) return;
            pts.push(point);
            render();
        }

        function finishStroke(e) {
            cachedCanvasRect = null;
            if (!state.drawing || state.pointerId !== e.pointerId) return;
            state.drawing = false;
            state.pointerId = null;

            if (state.currentStroke && state.currentStroke.points && state.currentStroke.points.length) {
                const pts = state.currentStroke.points;
                const first = pts[0];
                const last = pts[pts.length - 1];
                const shapeHasExtent = !SHAPE_TOOLS.has(state.currentStroke.tool)
                    || !first
                    || !last
                    || Math.abs(last.x - first.x) + Math.abs(last.y - first.y) > .5;

                if (shapeHasExtent) {
                    state.strokes.push(state.currentStroke);
                    state.redo = [];
                }
            }

            state.currentStroke = null;
            render();
            scheduleSave();
        }

        canvas.addEventListener("pointerdown", startStroke);
        canvas.addEventListener("pointermove", moveStroke);
        canvas.addEventListener("pointerup", finishStroke);
        canvas.addEventListener("pointercancel", finishStroke);

        function startPan(e) {
            if (state.tool !== "pan" || e.button !== 0) return;
            state.panning = true;
            state.pointerId = e.pointerId;
            state.panStartX = e.clientX;
            state.panStartY = e.clientY;
            state.panOriginX = state.panX;
            state.panOriginY = state.panY;
            stage.classList.add("is-panning");
            if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
            e.preventDefault();
        }

        function movePan(e) {
            if (!state.panning || state.pointerId !== e.pointerId) return;
            state.panX = state.panOriginX + (e.clientX - state.panStartX);
            state.panY = state.panOriginY + (e.clientY - state.panStartY);
            applyViewTransform();
        }

        function finishPan(e) {
            if (!state.panning || state.pointerId !== e.pointerId) return;
            state.panning = false;
            state.pointerId = null;
            stage.classList.remove("is-panning");
        }

        stage.addEventListener("pointerdown", startPan);
        stage.addEventListener("pointermove", movePan);
        stage.addEventListener("pointerup", finishPan);
        stage.addEventListener("pointercancel", finishPan);

        function applyViewTransform() {
            artboard.style.transform = "translate(-50%, -50%) translate(" + state.panX + "px, " + state.panY + "px) scale(" + state.zoom + ")";
            artboard.style.setProperty("--draw-paper", state.paper);
            stage.style.setProperty("--draw-paper", state.paper);
            if (zoomReadout) zoomReadout.textContent = "Zoom " + Math.round(state.zoom * 100) + "%";
        }

        function setZoom(value) {
            state.zoom = Math.max(0.35, Math.min(2.4, value));
            applyViewTransform();
            updateBrushCursorSize();
        }

        if (zoomInBtn) zoomInBtn.addEventListener("click", () => setZoom(state.zoom * 1.15));
        if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => setZoom(state.zoom / 1.15));
        if (zoomResetBtn) zoomResetBtn.addEventListener("click", () => setZoom(0.82));
        if (resetViewBtn) {
            resetViewBtn.addEventListener("click", () => {
                state.panX = 0;
                state.panY = 0;
                setZoom(0.82);
            });
        }

        stage.addEventListener("wheel", (e) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            e.preventDefault();
            setZoom(state.zoom * (e.deltaY < 0 ? 1.08 : 0.92));
        }, { passive: false });

        function setTool(tool) {
            if (!DRAW_TOOL_NAMES.has(tool)) return;
            state.tool = tool;
            document.querySelectorAll("[data-draw-tool]").forEach((btn) => {
                btn.classList.toggle("active", btn.getAttribute("data-draw-tool") === tool);
            });
            DRAW_TOOL_NAMES.forEach((name) => {
                stage.classList.toggle("tool-" + name, tool === name);
            });
            if (toolReadout) toolReadout.textContent = "Tool: " + tool.charAt(0).toUpperCase() + tool.slice(1);
            updateBrushPreview();
        }

        document.querySelectorAll("[data-draw-tool]").forEach((btn) => {
            btn.addEventListener("click", () => setTool(btn.getAttribute("data-draw-tool")));
        });

        function updateBrushPreview() {
            const isErase = state.tool === "eraser";
            if (brushPreview) {
                const previewSize = Math.max(6, Math.min(42, state.size * .72));
                brushPreview.style.width = previewSize + "px";
                brushPreview.style.height = previewSize + "px";
                brushPreview.style.setProperty("--preview-color", isErase ? "#f7f3eb" : state.color);
                brushPreview.style.setProperty("--preview-opacity", String(isErase ? .45 : state.opacity));
            }
            if (brushSummary) {
                const names = {
                    brush: "Round Brush",
                    eraser: "Soft Eraser",
                    line: "Line Tool",
                    rectangle: "Rectangle Tool",
                    ellipse: "Ellipse Tool",
                    eyedropper: "Eyedropper",
                    pan: "Canvas Hand"
                };
                const name = names[state.tool] || "Round Brush";
                const detail = state.tool === "eyedropper"
                    ? "Click canvas to sample color"
                    : state.tool === "pan"
                        ? "Drag to move canvas"
                        : SHAPE_TOOLS.has(state.tool)
                            ? state.size + "px stroke · Shift constrains"
                            : state.size + "px · " + Math.round(state.opacity * 100) + "% opacity";
                brushSummary.innerHTML = "<strong>" + name + "</strong><span>" + detail + "</span>";
            }
            updateBrushCursorSize();
        }

        function updateBrushCursorSize() {
            const rect = canvas.getBoundingClientRect();
            const pxPerLogical = rect.width / WIDTH;
            const diameter = Math.max(5, state.size * pxPerLogical);
            cursor.style.width = diameter + "px";
            cursor.style.height = diameter + "px";
            cursor.style.marginLeft = (-diameter / 2) + "px";
            cursor.style.marginTop = (-diameter / 2) + "px";
        }

        stage.addEventListener("pointerenter", () => {
            cachedStageRect = stage.getBoundingClientRect();
        }, { passive: true });

        stage.addEventListener("pointermove", (e) => {
            const rect = cachedStageRect || stage.getBoundingClientRect();
            cursor.style.transform = "translate3d(" + (e.clientX - rect.left) + "px, " + (e.clientY - rect.top) + "px, 0)";
            stage.classList.toggle("cursor-visible", state.tool === "brush" || state.tool === "eraser");
        });
        stage.addEventListener("pointerleave", () => {
            cachedStageRect = null;
            stage.classList.remove("cursor-visible");
        });

        if (colorInput) {
            colorInput.addEventListener("input", () => {
                state.color = colorInput.value;
                syncSwatches();
                updateBrushPreview();
            });
        }

        document.querySelectorAll("[data-draw-color]").forEach((swatch) => {
            swatch.addEventListener("click", () => {
                state.color = swatch.getAttribute("data-draw-color") || state.color;
                if (colorInput) colorInput.value = state.color;
                syncSwatches();
                updateBrushPreview();
            });
        });

        function syncSwatches() {
            document.querySelectorAll("[data-draw-color]").forEach((swatch) => {
                const value = (swatch.getAttribute("data-draw-color") || "").toLowerCase();
                swatch.classList.toggle("active", value === state.color.toLowerCase());
            });
        }

        if (sizeInput) {
            sizeInput.addEventListener("input", () => {
                state.size = Number(sizeInput.value);
                if (sizeValue) sizeValue.textContent = state.size + "px";
                updateBrushPreview();
            });
        }

        if (opacityInput) {
            opacityInput.addEventListener("input", () => {
                state.opacity = Number(opacityInput.value);
                if (opacityValue) opacityValue.textContent = Math.round(state.opacity * 100) + "%";
                updateBrushPreview();
            });
        }

        if (paperInput) {
            paperInput.addEventListener("input", () => {
                state.paper = paperInput.value;
                applyViewTransform();
                scheduleSave();
            });
        }

        function undo() {
            if (!state.strokes.length) return;
            state.redo.push(state.strokes.pop());
            render();
            scheduleSave();
        }

        function redo() {
            if (!state.redo.length) return;
            state.strokes.push(state.redo.pop());
            render();
            scheduleSave();
        }

        if (undoBtn) undoBtn.addEventListener("click", undo);
        if (redoBtn) redoBtn.addEventListener("click", redo);

        if (gridBtn) {
            gridBtn.addEventListener("click", () => {
                state.grid = !state.grid;
                stage.classList.toggle("show-grid", state.grid);
                gridBtn.classList.toggle("active", state.grid);
                gridBtn.setAttribute("aria-pressed", String(state.grid));
            });
        }

        function clearArtwork() {
            state.strokes = [];
            state.redo = [];
            render();
            saveLocal("Blank canvas saved");
        }

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                const label = clearBtn.querySelector(".draw-tool-label");
                if (!clearBtn.classList.contains("confirm-clear")) {
                    clearBtn.classList.add("confirm-clear");
                    if (label) label.textContent = "Sure?";
                    clearTimeout(state.clearTimer);
                    state.clearTimer = setTimeout(() => {
                        clearBtn.classList.remove("confirm-clear");
                        if (label) label.textContent = "Clear";
                    }, 2400);
                    return;
                }
                clearTimeout(state.clearTimer);
                clearBtn.classList.remove("confirm-clear");
                if (label) label.textContent = "Clear";
                clearArtwork();
            });
        }

        function payload() {
            return {
                version: 1,
                width: WIDTH,
                height: HEIGHT,
                paper: state.paper,
                color: state.color,
                size: state.size,
                opacity: state.opacity,
                strokes: state.strokes
            };
        }

        function saveLocal(message) {
            const text = message || "Artwork saved to private cloud";
            if (!personWorkspace || !personWorkspace.setArtwork) {
                setSavedStatus("Private Person Workspace is unavailable", true);
                return;
            }
            personWorkspace.setArtwork(payload());
            setSavedStatus(text, false);
        }

        function scheduleSave() {
            setSavedStatus("Saving…", false);
            clearTimeout(state.saveTimer);
            state.saveTimer = setTimeout(() => saveLocal(), 260);
        }

        function setSavedStatus(message, error) {
            if (saveNote) {
                saveNote.textContent = message;
                saveNote.style.color = error ? "#fb7185" : "var(--teal)";
            }
            if (drawNavStatusText) drawNavStatusText.textContent = message;
        }

        function loadLocal() {
            try {
                const data = personWorkspace && personWorkspace.getArtwork
                    ? personWorkspace.getArtwork()
                    : null;
                if (!data || data.version !== 1 || !Array.isArray(data.strokes)) return;

                state.strokes = data.strokes.filter((stroke) =>
                    stroke && DRAWABLE_TOOLS.has(stroke.tool) && Array.isArray(stroke.points)
                );
                if (typeof data.paper === "string") state.paper = data.paper;
                if (typeof data.color === "string") state.color = data.color;
                if (Number.isFinite(Number(data.size))) state.size = Number(data.size);
                if (Number.isFinite(Number(data.opacity))) state.opacity = Number(data.opacity);

                if (paperInput) paperInput.value = state.paper;
                if (colorInput) colorInput.value = state.color;
                if (sizeInput) sizeInput.value = String(state.size);
                if (opacityInput) opacityInput.value = String(state.opacity);
                if (sizeValue) sizeValue.textContent = state.size + "px";
                if (opacityValue) opacityValue.textContent = Math.round(state.opacity * 100) + "%";
                setSavedStatus("Restored private artwork", false);
            } catch (_) {
                setSavedStatus("Private artwork could not be restored", true);
            }
        }

        if (saveBtn) saveBtn.addEventListener("click", () => saveLocal());

        if (exportBtn) {
            exportBtn.addEventListener("click", () => {
                const out = document.createElement("canvas");
                out.width = WIDTH;
                out.height = HEIGHT;
                const outCtx = out.getContext("2d");
                if (!outCtx) return;
                outCtx.fillStyle = state.paper;
                outCtx.fillRect(0, 0, WIDTH, HEIGHT);
                outCtx.drawImage(canvas, 0, 0);

                const link = document.createElement("a");
                const stamp = new Date().toISOString().slice(0, 10);
                link.download = "dimension-studio-art-" + stamp + ".png";
                link.href = out.toDataURL("image/png");
                link.click();
                setSavedStatus("PNG exported", false);
            });
        }

        function updateUI() {
            if (undoBtn) undoBtn.disabled = state.strokes.length === 0;
            if (redoBtn) redoBtn.disabled = state.redo.length === 0;
            if (strokeReadout) {
                strokeReadout.textContent = state.strokes.length + " stroke" + (state.strokes.length === 1 ? "" : "s");
            }
        }

        document.addEventListener("keydown", (e) => {
            if (drawWorkspace.hidden) return;
            const target = e.target;
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;

            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key.toLowerCase() === "z") {
                e.preventDefault();
                if (e.shiftKey) redo(); else undo();
                return;
            }
            if (mod && e.key.toLowerCase() === "y") {
                e.preventDefault();
                redo();
                return;
            }

            const key = e.key.toLowerCase();
            if (key === "b") setTool("brush");
            else if (key === "e") setTool("eraser");
            else if (key === "l") setTool("line");
            else if (key === "r") setTool("rectangle");
            else if (key === "o") setTool("ellipse");
            else if (key === "i") setTool("eyedropper");
            else if (key === "p") setTool("pan");
            else if (e.key === "[") {
                state.size = Math.max(1, state.size - 2);
                if (sizeInput) sizeInput.value = String(state.size);
                if (sizeValue) sizeValue.textContent = state.size + "px";
                updateBrushPreview();
            } else if (e.key === "]") {
                state.size = Math.min(80, state.size + 2);
                if (sizeInput) sizeInput.value = String(state.size);
                if (sizeValue) sizeValue.textContent = state.size + "px";
                updateBrushPreview();
            }
        });

        loadLocal();
        syncSwatches();
        applyViewTransform();
        setTool("brush");
        updateBrushPreview();
        render();

        const initialMode = personWorkspace && personWorkspace.getStudioMode
            ? personWorkspace.getStudioMode()
            : "write";
        setMode(initialMode, false);
    }

    function bootWhenPersonIsReady() {
        if (personWorkspace && personWorkspace.onReady) personWorkspace.onReady(init);
        else init();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootWhenPersonIsReady, { once: true });
    } else {
        bootWhenPersonIsReady();
    }
})();
