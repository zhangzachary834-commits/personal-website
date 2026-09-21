(() => {
    "use strict";

    const STORAGE_KEY = "writers_of_light_request_v1";
    const RECIPIENT = "zhangzachary834@gmail.com";
    const byId = (id) => document.getElementById(id);

    function init() {
        const form = byId("wol-request-form");
        if (!form) return;

        const fields = {
            name: byId("wol-name"),
            email: byId("wol-email"),
            kind: byId("wol-kind"),
            title: byId("wol-title"),
            context: byId("wol-context"),
            draft: byId("wol-draft"),
            preserve: byId("wol-preserve"),
            tone: byId("wol-tone"),
            outcome: byId("wol-outcome")
        };
        const helpBoxes = [...document.querySelectorAll('input[name="wol-help"]')];
        const saveState = byId("wol-save-state");
        const previewTitle = byId("wol-preview-title");
        const previewMeta = byId("wol-preview-meta");
        const previewContext = byId("wol-preview-context");
        const previewDraft = byId("wol-preview-draft");
        const previewPreserve = byId("wol-preview-preserve");
        const previewHelp = byId("wol-preview-help");
        const wordCount = byId("wol-word-count");
        const clearBtn = byId("wol-clear-btn");
        const copyBtn = byId("wol-copy-btn");
        const sendBtn = byId("wol-send-btn");

        let saveTimer = null;

        function value(el) {
            return el ? el.value.trim() : "";
        }

        function selectedHelp() {
            return helpBoxes.filter((box) => box.checked).map((box) => box.value);
        }

        function state() {
            return {
                name: value(fields.name),
                email: value(fields.email),
                kind: value(fields.kind),
                title: value(fields.title),
                context: value(fields.context),
                draft: value(fields.draft),
                preserve: value(fields.preserve),
                tone: value(fields.tone),
                outcome: value(fields.outcome),
                help: selectedHelp()
            };
        }

        function setText(el, text, fallback) {
            if (!el) return;
            el.textContent = text || fallback;
            el.classList.toggle("wol-empty", !text);
        }

        function updatePreview() {
            const data = state();
            setText(previewTitle, data.title, "Untitled request");
            if (previewMeta) {
                const parts = [data.kind || "Writing assistance"];
                if (data.name) parts.push("from " + data.name);
                if (data.tone) parts.push(data.tone + " tone");
                previewMeta.textContent = parts.join(" · ");
            }
            setText(previewContext, data.context, "Tell us what this piece needs to carry, who it is for, and why it matters.");
            setText(previewDraft, data.draft, "Your rough words can be unfinished, fragmented, or just a few sentences.");
            setText(previewPreserve, data.preserve, "Name the phrases, beliefs, memories, facts, or emotional truths that must remain yours.");
            setText(previewHelp, data.help.length ? data.help.join(" · ") : "", "Choose the kinds of help you want.");

            const combined = [data.context, data.draft, data.preserve, data.outcome].join(" ");
            const words = combined.match(/\b[\p{L}\p{N}’'-]+\b/gu) || [];
            if (wordCount) wordCount.textContent = words.length + " words entrusted so far";
        }

        function setSave(message, error) {
            if (!saveState) return;
            saveState.textContent = message;
            saveState.style.color = error ? "#fb7185" : "var(--teal)";
        }

        function saveLocal() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state()));
                setSave("Saved privately in this browser", false);
            } catch (_) {
                setSave("This browser could not save the request", true);
            }
        }

        function scheduleSave() {
            setSave("Saving…", false);
            clearTimeout(saveTimer);
            saveTimer = setTimeout(saveLocal, 280);
        }

        function restore() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return;
                const data = JSON.parse(raw);
                Object.entries(fields).forEach(([key, el]) => {
                    if (el && typeof data[key] === "string") el.value = data[key];
                });
                if (Array.isArray(data.help)) {
                    helpBoxes.forEach((box) => { box.checked = data.help.includes(box.value); });
                }
                setSave("Restored your private local draft", false);
            } catch (_) {
                setSave("Could not restore the local draft", true);
            }
        }

        function requestText() {
            const data = state();
            return [
                "WRITERS OF LIGHT — COLLABORATION REQUEST",
                "",
                "Name: " + (data.name || "Not provided"),
                "Reply email: " + (data.email || "Not provided"),
                "Kind of writing: " + (data.kind || "Not specified"),
                "Working title / purpose: " + (data.title || "Untitled"),
                "Desired tone: " + (data.tone || "Not specified"),
                "Help requested: " + (data.help.length ? data.help.join(", ") : "Not specified"),
                "",
                "WHAT THIS NEEDS TO CARRY",
                data.context || "(not provided)",
                "",
                "ROUGH WORDS / CURRENT DRAFT",
                data.draft || "(not provided)",
                "",
                "WHAT MUST REMAIN YOURS",
                data.preserve || "(not provided)",
                "",
                "WHAT WOULD A GOOD OUTCOME LOOK LIKE?",
                data.outcome || "(not provided)",
                "",
                "—",
                "Prepared through Writers of Light · Dimension of Thought"
            ].join("\n");
        }

        async function copyRequest() {
            const text = requestText();
            try {
                await navigator.clipboard.writeText(text);
                setSave("Request copied to clipboard", false);
            } catch (_) {
                const area = document.createElement("textarea");
                area.value = text;
                area.style.position = "fixed";
                area.style.opacity = "0";
                document.body.appendChild(area);
                area.select();
                document.execCommand("copy");
                area.remove();
                setSave("Request copied to clipboard", false);
            }
        }

        function openEmail() {
            const data = state();
            const subject = "[Writers of Light] " + (data.title || data.kind || "Writing collaboration request");
            window.location.href =
                "mailto:" + RECIPIENT +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(requestText());
            setSave("Opened a pre-filled email — your local draft remains here", false);
        }

        function clearAll() {
            const confirmed = clearBtn && clearBtn.dataset.confirm === "yes";
            if (!confirmed) {
                if (clearBtn) {
                    clearBtn.dataset.confirm = "yes";
                    clearBtn.textContent = "Click again to clear";
                    setTimeout(() => {
                        if (!clearBtn) return;
                        delete clearBtn.dataset.confirm;
                        clearBtn.textContent = "Clear local draft";
                    }, 2600);
                }
                return;
            }

            form.reset();
            try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
            delete clearBtn.dataset.confirm;
            clearBtn.textContent = "Clear local draft";
            updatePreview();
            setSave("Local draft cleared", false);
        }

        form.addEventListener("input", () => {
            updatePreview();
            scheduleSave();
        });
        form.addEventListener("change", () => {
            updatePreview();
            scheduleSave();
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            saveLocal();
            openEmail();
        });

        if (clearBtn) clearBtn.addEventListener("click", clearAll);
        if (copyBtn) copyBtn.addEventListener("click", copyRequest);
        if (sendBtn) sendBtn.addEventListener("click", () => {
            saveLocal();
            openEmail();
        });

        restore();
        updatePreview();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
