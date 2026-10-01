(function (root, factory) {
    const helpers = factory();
    if (typeof module === "object" && module.exports) module.exports = helpers;
    if (root && root.document) {
        root.DimensionGoogleDocs = helpers;
        helpers.init(root);
    }
})(typeof window !== "undefined" ? window : null, function () {
    "use strict";

    const DOCS_API = "https://docs.googleapis.com/v1/documents";
    const DEFAULT_SCOPE = "https://www.googleapis.com/auth/documents";

    function extractDocumentId(value) {
        const raw = String(value || "").trim();
        if (!raw) return "";
        const urlMatch = raw.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
        if (urlMatch) return urlMatch[1];
        return /^[a-zA-Z0-9_-]{12,}$/.test(raw) ? raw : "";
    }

    function getPrimaryBody(documentResource) {
        if (!documentResource || typeof documentResource !== "object") {
            return { content: [], tabId: null };
        }

        const firstTab = Array.isArray(documentResource.tabs) ? documentResource.tabs[0] : null;
        const documentTab = firstTab && firstTab.documentTab;
        if (documentTab && documentTab.body) {
            return {
                content: Array.isArray(documentTab.body.content) ? documentTab.body.content : [],
                tabId: firstTab.tabProperties && firstTab.tabProperties.tabId
                    ? firstTab.tabProperties.tabId
                    : null
            };
        }

        return {
            content: documentResource.body && Array.isArray(documentResource.body.content)
                ? documentResource.body.content
                : [],
            tabId: null
        };
    }

    function structuralElementText(element) {
        if (!element) return "";

        if (element.paragraph && Array.isArray(element.paragraph.elements)) {
            return element.paragraph.elements.map((part) => {
                if (part.textRun && typeof part.textRun.content === "string") {
                    return part.textRun.content;
                }
                return "";
            }).join("");
        }

        if (element.table && Array.isArray(element.table.tableRows)) {
            return element.table.tableRows.map((row) => {
                const cells = Array.isArray(row.tableCells) ? row.tableCells : [];
                return cells.map((cell) => {
                    const content = Array.isArray(cell.content) ? cell.content : [];
                    return content.map(structuralElementText).join("").replace(/\n$/, "");
                }).join("\t");
            }).join("\n") + "\n";
        }

        if (element.tableOfContents && Array.isArray(element.tableOfContents.content)) {
            return element.tableOfContents.content.map(structuralElementText).join("");
        }

        return "";
    }

    function extractDocumentText(documentResource) {
        const body = getPrimaryBody(documentResource);
        const text = body.content.map(structuralElementText).join("");
        // Google Docs owns one terminal paragraph newline. Remove only that newline;
        // if the Studio source itself ended in a newline, it remains as the preceding one.
        return text.endsWith("\n") ? text.slice(0, -1) : text;
    }

    function getDocumentEndIndex(documentResource) {
        const body = getPrimaryBody(documentResource);
        let endIndex = 1;
        body.content.forEach((element) => {
            if (Number.isFinite(element && element.endIndex)) {
                endIndex = Math.max(endIndex, element.endIndex);
            }
        });
        return endIndex;
    }

    function makeRange(startIndex, endIndex, tabId) {
        const range = { startIndex, endIndex };
        if (tabId) range.tabId = tabId;
        return range;
    }

    function init(win) {
        const doc = win.document;
        const ready = () => {
            const openButton = doc.getElementById("open-google-docs-sync-btn");
            const modal = doc.getElementById("google-docs-modal-backdrop");
            if (!openButton || !modal) return;

            const closeButton = doc.getElementById("close-google-docs-modal-btn");
            const createButton = doc.getElementById("google-docs-create-btn");
            const linkButton = doc.getElementById("google-docs-link-btn");
            const pullButton = doc.getElementById("google-docs-pull-btn");
            const pushButton = doc.getElementById("google-docs-push-btn");
            const forcePushButton = doc.getElementById("google-docs-force-push-btn");
            const openDocButton = doc.getElementById("google-docs-open-btn");
            const unlinkButton = doc.getElementById("google-docs-unlink-btn");
            const linkInput = doc.getElementById("google-docs-link-input");
            const summary = doc.getElementById("google-docs-sync-summary");
            const status = doc.getElementById("google-docs-sync-status");
            const configNote = doc.getElementById("google-docs-config-note");
            const conflictNote = doc.getElementById("google-docs-conflict-note");
            const syncDot = doc.getElementById("google-docs-sync-dot");

            function getBridge() {
                return win.DimensionStudioBridge || null;
            }

            function getConfig() {
                const rootConfig = win.DimensionStudioConfig || {};
                const config = rootConfig.google || rootConfig.googleDocs || {};
                return {
                    clientId: config.clientId ? String(config.clientId).trim() : "",
                    scope: config.scope ? String(config.scope).trim() : DEFAULT_SCOPE
                };
            }

            function setStatus(message, kind) {
                if (!status) return;
                status.textContent = message || "";
                status.classList.remove("error", "success");
                if (kind) status.classList.add(kind);
            }

            function setBusy(button, busy, label) {
                if (!button) return;
                button.disabled = !!busy;
                if (busy) {
                    if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent;
                    button.textContent = label || "Working…";
                } else if (button.dataset.originalLabel) {
                    button.textContent = button.dataset.originalLabel;
                    delete button.dataset.originalLabel;
                }
            }

            function currentMeta() {
                const bridge = getBridge();
                const draft = bridge && bridge.getCurrentDraftSnapshot
                    ? bridge.getCurrentDraftSnapshot()
                    : null;
                return draft && draft.googleDocs ? draft.googleDocs : null;
            }

            function updateMeta(meta) {
                const bridge = getBridge();
                if (!bridge || !bridge.setGoogleDocsMeta) {
                    throw new Error("The Studio bridge is not ready. Reload the page and try again.");
                }
                bridge.setGoogleDocsMeta(meta);
                refreshUI();
            }

            function refreshUI() {
                const config = getConfig();
                const meta = currentMeta();
                if (configNote) configNote.hidden = !!config.clientId;
                if (syncDot) syncDot.classList.toggle("linked", !!(meta && meta.documentId));

                if (summary) {
                    if (meta && meta.documentId) {
                        const when = meta.lastSyncedAt
                            ? new Date(meta.lastSyncedAt).toLocaleString()
                            : "Not synced yet";
                        summary.innerHTML = "";
                        const title = doc.createElement("strong");
                        title.textContent = "Linked Google Doc";
                        const id = doc.createElement("span");
                        id.textContent = "Document " + meta.documentId;
                        const synced = doc.createElement("span");
                        synced.textContent = "Last sync: " + when +
                            (meta.lastDirection ? " · " + meta.lastDirection : "");
                        summary.append(title, id, synced);
                    } else {
                        summary.innerHTML = "";
                        const title = doc.createElement("strong");
                        title.textContent = "No Google Doc linked";
                        const hint = doc.createElement("span");
                        hint.textContent = "Create a new Doc or link an existing one to this Studio draft.";
                        summary.append(title, hint);
                    }
                }

                const linked = !!(meta && meta.documentId);
                [pullButton, pushButton, openDocButton, unlinkButton].forEach((button) => {
                    if (button) button.disabled = !linked;
                });
                if (forcePushButton && !linked) forcePushButton.hidden = true;
            }

            async function ensureToken() {
                const personWorkspace = win.DimensionPersonWorkspace;
                if (!personWorkspace || !personWorkspace.getAccessToken || !personWorkspace.isReady()) {
                    throw new Error("Enter your Person Workspace before using Google Docs sync.");
                }
                return personWorkspace.getAccessToken({ interactive: true });
            }

            async function apiFetch(url, options, mayRetry) {
                const token = await ensureToken();
                const request = Object.assign({}, options || {});
                request.headers = Object.assign({}, request.headers || {}, {
                    Authorization: "Bearer " + token
                });
                if (request.body && !request.headers["Content-Type"]) {
                    request.headers["Content-Type"] = "application/json";
                }

                let response = await win.fetch(url, request);
                if (response.status === 401 && mayRetry !== false) {
                    return apiFetch(url, options, false);
                }

                let payload = null;
                const text = await response.text();
                if (text) {
                    try { payload = JSON.parse(text); } catch (_) { payload = { raw: text }; }
                }

                if (!response.ok) {
                    const message = payload && payload.error && payload.error.message
                        ? payload.error.message
                        : "Google Docs request failed (" + response.status + ").";
                    throw new Error(message);
                }
                return payload || {};
            }

            async function fetchDocument(documentId) {
                return apiFetch(
                    DOCS_API + "/" + encodeURIComponent(documentId) + "?includeTabsContent=true",
                    { method: "GET" }
                );
            }

            function docUrl(documentId) {
                return "https://docs.google.com/document/d/" + encodeURIComponent(documentId) + "/edit";
            }

            async function createDocument() {
                const bridge = getBridge();
                const draft = bridge && bridge.getCurrentDraftSnapshot
                    ? bridge.getCurrentDraftSnapshot()
                    : null;
                const title = draft && draft.title ? draft.title : "Dimension of Thought Draft";

                setBusy(createButton, true, "Creating…");
                setStatus("Creating a Google Doc…");
                try {
                    const created = await apiFetch(DOCS_API, {
                        method: "POST",
                        body: JSON.stringify({ title })
                    });
                    updateMeta({
                        documentId: created.documentId,
                        documentUrl: docUrl(created.documentId),
                        revisionId: created.revisionId || "",
                        lastSyncedAt: null,
                        lastDirection: "",
                        hasSynced: false
                    });
                    if (linkInput) linkInput.value = created.documentId;
                    setStatus("Google Doc created. Sending this Studio draft into it…");
                    await pushToDocument(true);
                } catch (error) {
                    setStatus(error.message, "error");
                } finally {
                    setBusy(createButton, false);
                }
            }

            async function linkDocument() {
                const documentId = extractDocumentId(linkInput && linkInput.value);
                if (!documentId) {
                    setStatus("Paste a valid Google Docs URL or document ID.", "error");
                    return;
                }

                setBusy(linkButton, true, "Linking…");
                setStatus("Checking that Google Doc…");
                try {
                    const remote = await fetchDocument(documentId);
                    updateMeta({
                        documentId,
                        documentUrl: docUrl(documentId),
                        revisionId: remote.revisionId || "",
                        lastSyncedAt: null,
                        lastDirection: "",
                        hasSynced: false
                    });
                    setStatus("Linked. Choose Pull from Docs or Push to Docs.", "success");
                } catch (error) {
                    setStatus(error.message, "error");
                } finally {
                    setBusy(linkButton, false);
                }
            }

            async function pullFromDocument() {
                const meta = currentMeta();
                const bridge = getBridge();
                if (!meta || !meta.documentId || !bridge) return;

                setBusy(pullButton, true, "Pulling…");
                setStatus("Reading Google Docs…");
                try {
                    const remote = await fetchDocument(meta.documentId);
                    const remoteText = extractDocumentText(remote);
                    const local = bridge.getCurrentDraftSnapshot ? bridge.getCurrentDraftSnapshot() : null;
                    const localText = local && typeof local.content === "string" ? local.content : "";

                    if (localText && localText !== remoteText) {
                        const ok = win.confirm(
                            "Pulling will replace the current Studio body with the Google Doc body. Continue?"
                        );
                        if (!ok) {
                            setStatus("Pull cancelled.");
                            return;
                        }
                    }

                    bridge.applyGoogleDocsBody(remoteText);
                    updateMeta(Object.assign({}, meta, {
                        revisionId: remote.revisionId || "",
                        lastSyncedAt: Date.now(),
                        lastDirection: "pulled from Google Docs",
                        hasSynced: true
                    }));
                    if (forcePushButton) forcePushButton.hidden = true;
                    if (conflictNote) conflictNote.hidden = true;
                    setStatus("Pulled the latest Google Doc into Studio.", "success");
                } catch (error) {
                    setStatus(error.message, "error");
                } finally {
                    setBusy(pullButton, false);
                }
            }

            async function pushToDocument(force) {
                const meta = currentMeta();
                const bridge = getBridge();
                if (!meta || !meta.documentId || !bridge) return;

                setBusy(pushButton, true, force ? "Force pushing…" : "Pushing…");
                if (forcePushButton) forcePushButton.disabled = true;
                setStatus("Checking the Google Doc revision…");

                try {
                    if (!meta.hasSynced && !force) {
                        const ok = win.confirm(
                            "This linked Google Doc has not been synced before. Pushing will replace its body with the Studio Markdown source. Continue?"
                        );
                        if (!ok) {
                            setStatus("Push cancelled.");
                            return;
                        }
                    }

                    const remote = await fetchDocument(meta.documentId);
                    if (!force && meta.hasSynced && meta.revisionId &&
                        remote.revisionId && meta.revisionId !== remote.revisionId) {
                        if (conflictNote) conflictNote.hidden = false;
                        if (forcePushButton) forcePushButton.hidden = false;
                        setStatus(
                            "Google Docs changed since the last sync. Pull first, or force-push only if you intend to overwrite those remote edits.",
                            "error"
                        );
                        return;
                    }

                    const draft = bridge.getCurrentDraftSnapshot();
                    const source = draft && typeof draft.content === "string" ? draft.content : "";
                    const primary = getPrimaryBody(remote);
                    const endIndex = getDocumentEndIndex(remote);
                    const requests = [];

                    if (endIndex > 2) {
                        requests.push({
                            deleteContentRange: {
                                range: makeRange(1, endIndex - 1, primary.tabId)
                            }
                        });
                    }

                    if (source) {
                        const insertText = {
                            location: { index: 1 },
                            text: source
                        };
                        if (primary.tabId) insertText.location.tabId = primary.tabId;
                        requests.push({ insertText });
                    }

                    if (requests.length) {
                        await apiFetch(
                            DOCS_API + "/" + encodeURIComponent(meta.documentId) + ":batchUpdate",
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    requests,
                                    writeControl: remote.revisionId
                                        ? { requiredRevisionId: remote.revisionId }
                                        : undefined
                                })
                            }
                        );
                    }

                    const refreshed = await fetchDocument(meta.documentId);
                    updateMeta(Object.assign({}, meta, {
                        revisionId: refreshed.revisionId || remote.revisionId || "",
                        lastSyncedAt: Date.now(),
                        lastDirection: force ? "force-pushed to Google Docs" : "pushed to Google Docs",
                        hasSynced: true
                    }));
                    if (forcePushButton) forcePushButton.hidden = true;
                    if (conflictNote) conflictNote.hidden = true;
                    setStatus("Studio Markdown is synced to Google Docs.", "success");
                } catch (error) {
                    setStatus(error.message, "error");
                } finally {
                    setBusy(pushButton, false);
                    if (forcePushButton) forcePushButton.disabled = false;
                }
            }

            function openLinkedDocument() {
                const meta = currentMeta();
                if (meta && meta.documentId) {
                    win.open(meta.documentUrl || docUrl(meta.documentId), "_blank", "noopener,noreferrer");
                }
            }

            function unlinkDocument() {
                const meta = currentMeta();
                if (!meta || !meta.documentId) return;
                if (!win.confirm("Unlink this Google Doc from the current Studio draft? The Google Doc itself will not be deleted.")) {
                    return;
                }
                updateMeta(null);
                if (linkInput) linkInput.value = "";
                if (forcePushButton) forcePushButton.hidden = true;
                if (conflictNote) conflictNote.hidden = true;
                setStatus("Google Doc unlinked.");
            }

            function openModal() {
                modal.removeAttribute("hidden");
                const meta = currentMeta();
                if (linkInput && meta && meta.documentId) linkInput.value = meta.documentId;
                refreshUI();
            }

            function closeModal() {
                modal.setAttribute("hidden", "");
            }

            openButton.addEventListener("click", openModal);
            if (closeButton) closeButton.addEventListener("click", closeModal);
            modal.addEventListener("click", (event) => {
                if (event.target === modal) closeModal();
            });
            if (createButton) createButton.addEventListener("click", createDocument);
            if (linkButton) linkButton.addEventListener("click", linkDocument);
            if (pullButton) pullButton.addEventListener("click", pullFromDocument);
            if (pushButton) pushButton.addEventListener("click", () => pushToDocument(false));
            if (forcePushButton) forcePushButton.addEventListener("click", () => pushToDocument(true));
            if (openDocButton) openDocButton.addEventListener("click", openLinkedDocument);
            if (unlinkButton) unlinkButton.addEventListener("click", unlinkDocument);

            win.addEventListener("dimension:studio-draft-changed", refreshUI);
            refreshUI();
        };

        if (doc.readyState === "loading") {
            doc.addEventListener("DOMContentLoaded", ready, { once: true });
        } else {
            ready();
        }
    }

    return {
        init,
        extractDocumentId,
        getPrimaryBody,
        extractDocumentText,
        getDocumentEndIndex
    };
});
