(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root && root.document) {
        root.DimensionPersonWorkspace = api.createRuntime(root);
    }
})(typeof window !== "undefined" ? window : null, function () {
    "use strict";

    const WORKSPACE_FILE = "dimension-of-thought-person-workspace.json";
    const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
    const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";
    const USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";
    const SCHEMA_VERSION = 1;

    function clone(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
    }

    function normalizePersonClaims(claims) {
        if (!claims || !claims.sub) throw new Error("Google did not return a stable Person identity.");
        return {
            id: "google:" + claims.sub,
            displayName: claims.name || claims.email || "Person",
            email: claims.email || "",
            picture: claims.picture || "",
            providerIdentity: {
                provider: "google",
                subject: String(claims.sub)
            }
        };
    }

    function emptyWorkspace(person) {
        return {
            schemaVersion: SCHEMA_VERSION,
            person: {
                id: person.id,
                displayName: person.displayName,
                providerIdentity: clone(person.providerIdentity)
            },
            drafts: [],
            activeDraftId: null,
            artwork: null,
            studioMode: "write",
            updatedAt: Date.now()
        };
    }

    function normalizeWorkspace(raw, person) {
        const base = emptyWorkspace(person);
        if (!raw || typeof raw !== "object") return base;

        if (raw.person && raw.person.id && raw.person.id !== person.id) {
            throw new Error("This private workspace belongs to a different Person.");
        }

        base.drafts = Array.isArray(raw.drafts) ? clone(raw.drafts) : [];
        base.activeDraftId = typeof raw.activeDraftId === "string" ? raw.activeDraftId : null;
        base.artwork = raw.artwork && typeof raw.artwork === "object" ? clone(raw.artwork) : null;
        base.studioMode = raw.studioMode === "draw" ? "draw" : "write";
        base.updatedAt = Number.isFinite(Number(raw.updatedAt)) ? Number(raw.updatedAt) : Date.now();
        return base;
    }

    function legacyPayload(storage) {
        if (!storage) return null;
        let drafts = [];
        let artwork = null;
        let activeDraftId = null;
        let studioMode = "write";

        try {
            const rawDrafts = storage.getItem("dimension_drafts_v1");
            if (rawDrafts) {
                const parsed = JSON.parse(rawDrafts);
                if (Array.isArray(parsed)) drafts = parsed;
            }
        } catch (_) {}

        try {
            activeDraftId = storage.getItem("dimension_active_draft_id") || null;
        } catch (_) {}

        try {
            const rawArtwork = storage.getItem("dimension_studio_art_v1");
            if (rawArtwork) {
                const parsed = JSON.parse(rawArtwork);
                if (parsed && typeof parsed === "object") artwork = parsed;
            }
        } catch (_) {}

        try {
            studioMode = storage.getItem("dimension_studio_mode") === "draw" ? "draw" : "write";
        } catch (_) {}

        if (!drafts.length && !artwork) return null;
        return { drafts, artwork, activeDraftId, studioMode };
    }

    function applyLegacyPayload(workspace, legacy) {
        if (!legacy) return workspace;
        workspace.drafts = clone(legacy.drafts || []);
        workspace.artwork = clone(legacy.artwork || null);
        workspace.activeDraftId = legacy.activeDraftId || null;
        workspace.studioMode = legacy.studioMode === "draw" ? "draw" : "write";
        workspace.updatedAt = Date.now();
        return workspace;
    }

    function createRuntime(win) {
        let accessToken = "";
        let tokenExpiresAt = 0;
        let tokenGrantedOnce = false;
        let person = null;
        let workspace = null;
        let workspaceFileId = "";
        let workspaceModifiedTime = "";
        let ready = false;
        let saveTimer = null;
        let saveChain = Promise.resolve();
        let cloudConflict = false;
        let initializerQueue = [];
        let migrationPendingCleanup = false;

        const runtime = {
            onReady,
            isReady: () => ready,
            getPerson: () => clone(person),
            getAccessToken,
            getDrafts: () => workspace ? clone(workspace.drafts) : [],
            saveDrafts,
            getActiveDraftId: () => workspace ? workspace.activeDraftId : null,
            setActiveDraftId,
            getArtwork: () => workspace ? clone(workspace.artwork) : null,
            setArtwork,
            getStudioMode: () => workspace ? workspace.studioMode : "write",
            setStudioMode,
            flushCloud,
            signIn,
            signOut
        };

        function getConfig() {
            const rootConfig = win.DimensionStudioConfig || {};
            const config = rootConfig.google || rootConfig.googleDocs || {};
            const defaultScope = [
                "openid",
                "email",
                "profile",
                "https://www.googleapis.com/auth/drive.appdata",
                "https://www.googleapis.com/auth/documents"
            ].join(" ");
            return {
                clientId: String(config.clientId || "").trim(),
                scope: String(config.scope || defaultScope).trim()
            };
        }

        function byId(id) {
            return win.document.getElementById(id);
        }

        function setGateMessage(message, error) {
            const el = byId("person-gate-status");
            if (!el) return;
            el.textContent = message || "";
            el.classList.toggle("error", !!error);
        }

        function setCloudStatus(message, error) {
            const gate = byId("person-cloud-status");
            if (gate) {
                gate.textContent = message || "";
                gate.classList.toggle("error", !!error);
            }
            const nav = byId("person-workspace-state");
            if (nav) nav.textContent = message || (ready ? "Private cloud ready" : "Locked");
        }

        function refreshPersonUI() {
            const button = byId("person-workspace-btn");
            const name = byId("person-workspace-name");
            const dot = byId("person-workspace-dot");
            const panelName = byId("person-panel-name");
            const panelEmail = byId("person-panel-email");
            const avatar = byId("person-panel-avatar");

            if (button) button.classList.toggle("is-authenticated", !!ready);
            if (dot) dot.classList.toggle("linked", !!ready);
            if (name) name.textContent = ready && person ? person.displayName : "Person Workspace";
            if (panelName) panelName.textContent = person ? person.displayName : "No Person present";
            if (panelEmail) panelEmail.textContent = person ? person.email : "";
            if (avatar) {
                if (person && person.picture) {
                    avatar.src = person.picture;
                    avatar.hidden = false;
                } else {
                    avatar.hidden = true;
                }
            }
        }

        function lockWorkspace() {
            ready = false;
            const gate = byId("person-workspace-gate");
            if (gate) gate.hidden = false;
            const article = byId("studio-workspace");
            const drawing = byId("draw-studio-workspace");
            if (article) article.hidden = true;
            if (drawing) drawing.hidden = true;
            refreshPersonUI();
        }

        function unlockWorkspace() {
            const gate = byId("person-workspace-gate");
            if (gate) gate.hidden = true;
            ready = true;
            refreshPersonUI();
            initializerQueue.splice(0).forEach((fn) => {
                try { fn(); } catch (error) { win.console.error(error); }
            });
            win.dispatchEvent(new CustomEvent("dimension:person-workspace-ready", {
                detail: { person: clone(person) }
            }));
        }

        function onReady(fn) {
            if (typeof fn !== "function") return;
            if (ready) fn();
            else initializerQueue.push(fn);
        }

        async function waitForGoogleIdentity() {
            for (let i = 0; i < 60; i += 1) {
                if (win.google && win.google.accounts && win.google.accounts.oauth2) return;
                await new Promise((resolve) => win.setTimeout(resolve, 100));
            }
            throw new Error("Google Identity Services did not load. Check your connection and reload.");
        }

        async function getAccessToken(options) {
            const opts = options || {};
            if (accessToken && Date.now() < tokenExpiresAt - 60000) return accessToken;

            const config = getConfig();
            if (!config.clientId) {
                throw new Error("The Google OAuth client ID is not configured yet.");
            }

            if (opts.interactive === false && !tokenGrantedOnce) {
                throw new Error("Person authorization is required.");
            }

            await waitForGoogleIdentity();

            return new Promise((resolve, reject) => {
                const client = win.google.accounts.oauth2.initTokenClient({
                    client_id: config.clientId,
                    scope: config.scope,
                    include_granted_scopes: true,
                    callback: (response) => {
                        if (!response || response.error) {
                            reject(new Error(
                                response && response.error_description
                                    ? response.error_description
                                    : "Google authorization was not completed."
                            ));
                            return;
                        }
                        accessToken = response.access_token;
                        tokenExpiresAt = Date.now() + Number(response.expires_in || 3600) * 1000;
                        tokenGrantedOnce = true;
                        resolve(accessToken);
                    }
                });

                client.requestAccessToken({
                    prompt: tokenGrantedOnce ? "" : "consent"
                });
            });
        }

        async function authorizedFetch(url, options, interactive) {
            let token = await getAccessToken({ interactive: interactive !== false });
            const request = Object.assign({}, options || {});
            request.headers = Object.assign({}, request.headers || {}, {
                Authorization: "Bearer " + token
            });

            let response = await win.fetch(url, request);
            if (response.status === 401 && interactive !== false) {
                accessToken = "";
                tokenExpiresAt = 0;
                token = await getAccessToken({ interactive: true });
                request.headers.Authorization = "Bearer " + token;
                response = await win.fetch(url, request);
            }
            return response;
        }

        async function readJsonResponse(response, fallback) {
            const text = await response.text();
            let payload = null;
            if (text) {
                try { payload = JSON.parse(text); } catch (_) { payload = null; }
            }
            if (!response.ok) {
                const message = payload && payload.error && payload.error.message
                    ? payload.error.message
                    : (fallback || "Google request failed") + " (" + response.status + ").";
                throw new Error(message);
            }
            return payload || {};
        }

        async function fetchPersonClaims() {
            const response = await authorizedFetch(USERINFO_ENDPOINT, { method: "GET" }, true);
            return readJsonResponse(response, "Could not identify the current Person");
        }

        async function findWorkspaceFile() {
            const query = "name = '" + WORKSPACE_FILE.replace(/'/g, "\\'") + "'";
            const params = new URLSearchParams({
                spaces: "appDataFolder",
                pageSize: "10",
                fields: "files(id,name,modifiedTime)",
                q: query
            });
            const response = await authorizedFetch(DRIVE_API + "?" + params.toString(), { method: "GET" }, true);
            const payload = await readJsonResponse(response, "Could not search the private Person Workspace");
            const files = Array.isArray(payload.files) ? payload.files.slice() : [];
            files.sort((a, b) => String(b.modifiedTime || "").localeCompare(String(a.modifiedTime || "")));
            return files[0] || null;
        }

        async function loadWorkspaceFile(file) {
            const response = await authorizedFetch(
                DRIVE_API + "/" + encodeURIComponent(file.id) + "?alt=media",
                { method: "GET" },
                true
            );
            const payload = await readJsonResponse(response, "Could not load the private Person Workspace");
            workspaceFileId = file.id;
            workspaceModifiedTime = file.modifiedTime || "";
            return normalizeWorkspace(payload, person);
        }

        async function createWorkspaceFile() {
            const response = await authorizedFetch(
                DRIVE_API + "?fields=id,name,modifiedTime",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: WORKSPACE_FILE,
                        mimeType: "application/json",
                        parents: ["appDataFolder"]
                    })
                },
                true
            );
            const created = await readJsonResponse(response, "Could not create the private Person Workspace");
            workspaceFileId = created.id;
            workspaceModifiedTime = created.modifiedTime || "";
        }

        async function fetchWorkspaceMetadata() {
            if (!workspaceFileId) return null;
            const response = await authorizedFetch(
                DRIVE_API + "/" + encodeURIComponent(workspaceFileId) + "?fields=id,modifiedTime",
                { method: "GET" },
                false
            );
            return readJsonResponse(response, "Could not verify the private Person Workspace");
        }

        async function uploadWorkspace() {
            if (!workspaceFileId) await createWorkspaceFile();

            if (workspaceModifiedTime) {
                const metadata = await fetchWorkspaceMetadata();
                if (
                    metadata &&
                    metadata.modifiedTime &&
                    workspaceModifiedTime &&
                    metadata.modifiedTime !== workspaceModifiedTime
                ) {
                    cloudConflict = true;
                    throw new Error("This Person Workspace changed on another device. Reload before overwriting it.");
                }
            }

            workspace.updatedAt = Date.now();
            workspace.person = {
                id: person.id,
                displayName: person.displayName,
                providerIdentity: clone(person.providerIdentity)
            };

            const response = await authorizedFetch(
                DRIVE_UPLOAD_API + "/" + encodeURIComponent(workspaceFileId) + "?uploadType=media",
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(workspace)
                },
                false
            );
            if (!response.ok) {
                await readJsonResponse(response, "Could not save the private Person Workspace");
            }

            const metadata = await fetchWorkspaceMetadata();
            if (metadata && metadata.modifiedTime) workspaceModifiedTime = metadata.modifiedTime;
            cloudConflict = false;

            if (migrationPendingCleanup) {
                clearLegacyPrivateStorage();
                migrationPendingCleanup = false;
            }
        }

        function clearLegacyPrivateStorage() {
            try {
                [
                    "dimension_drafts_v1",
                    "dimension_active_draft_id",
                    "dimension_studio_art_v1",
                    "dimension_studio_mode"
                ].forEach((key) => win.localStorage.removeItem(key));
            } catch (_) {}
        }

        function scheduleCloudSave() {
            if (!ready || !workspace || cloudConflict) return;
            win.clearTimeout(saveTimer);
            setCloudStatus("Saving private workspace…", false);
            saveTimer = win.setTimeout(() => {
                flushCloud().catch(() => {});
            }, 550);
        }

        function flushCloud() {
            if (!workspace || !person) return Promise.resolve();
            win.clearTimeout(saveTimer);
            saveChain = saveChain.then(async () => {
                try {
                    await uploadWorkspace();
                    setCloudStatus("Private cloud saved", false);
                    win.dispatchEvent(new CustomEvent("dimension:person-workspace-saved"));
                } catch (error) {
                    setCloudStatus(error.message, true);
                    throw error;
                }
            });
            return saveChain;
        }

        function saveDrafts(drafts) {
            if (!workspace) return;
            workspace.drafts = clone(Array.isArray(drafts) ? drafts : []);
            scheduleCloudSave();
        }

        function setActiveDraftId(id) {
            if (!workspace) return;
            workspace.activeDraftId = id || null;
            scheduleCloudSave();
        }

        function setArtwork(artwork) {
            if (!workspace) return;
            workspace.artwork = artwork ? clone(artwork) : null;
            scheduleCloudSave();
        }

        function setStudioMode(mode) {
            if (!workspace) return;
            workspace.studioMode = mode === "draw" ? "draw" : "write";
            scheduleCloudSave();
        }

        async function signIn() {
            const button = byId("person-sign-in-btn");
            if (button) button.disabled = true;
            setGateMessage("Opening your private Person Workspace…", false);

            try {
                const config = getConfig();
                if (!config.clientId) {
                    throw new Error("Google setup is not finished yet: add the OAuth client ID first.");
                }

                await getAccessToken({ interactive: true });
                const claims = await fetchPersonClaims();
                person = normalizePersonClaims(claims);

                const file = await findWorkspaceFile();
                if (file) {
                    workspace = await loadWorkspaceFile(file);
                    setCloudStatus("Private cloud loaded", false);
                } else {
                    workspace = emptyWorkspace(person);
                    const legacy = legacyPayload(win.localStorage);
                    if (legacy) {
                        const shouldImport = win.confirm(
                            "Browser-only Studio work from before Person Workspaces was found. Import it into " +
                            person.displayName + "'s private Person Workspace?"
                        );
                        if (shouldImport) {
                            applyLegacyPayload(workspace, legacy);
                            migrationPendingCleanup = true;
                        }
                    }
                    await uploadWorkspace();
                    setCloudStatus("Private cloud created", false);
                }

                unlockWorkspace();
                setGateMessage("", false);
            } catch (error) {
                setGateMessage(error.message, true);
                setCloudStatus(error.message, true);
            } finally {
                if (button) button.disabled = false;
            }
        }

        async function signOut() {
            try {
                await flushCloud();
            } catch (_) {}

            const token = accessToken;
            accessToken = "";
            tokenExpiresAt = 0;
            ready = false;
            person = null;
            workspace = null;
            workspaceFileId = "";
            workspaceModifiedTime = "";

            if (token && win.google && win.google.accounts && win.google.accounts.oauth2) {
                try {
                    win.google.accounts.oauth2.revoke(token, () => {});
                } catch (_) {}
            }

            win.location.reload();
        }

        function openPersonPanel() {
            const modal = byId("person-workspace-modal-backdrop");
            if (modal) modal.hidden = false;
            refreshPersonUI();
        }

        function closePersonPanel() {
            const modal = byId("person-workspace-modal-backdrop");
            if (modal) modal.hidden = true;
        }

        function bootUI() {
            if (!byId("studio-workspace")) return;
            lockWorkspace();

            const config = getConfig();
            const configNote = byId("person-config-note");
            if (configNote) configNote.hidden = !!config.clientId;

            const signInButton = byId("person-sign-in-btn");
            const personButton = byId("person-workspace-btn");
            const closeButton = byId("close-person-workspace-modal-btn");
            const signOutButton = byId("person-sign-out-btn");
            const reloadButton = byId("person-reload-page-btn");
            const modal = byId("person-workspace-modal-backdrop");

            if (signInButton) signInButton.addEventListener("click", signIn);
            if (personButton) personButton.addEventListener("click", () => {
                if (ready) openPersonPanel();
                else {
                    const gate = byId("person-workspace-gate");
                    if (gate) gate.hidden = false;
                }
            });
            if (closeButton) closeButton.addEventListener("click", closePersonPanel);
            if (signOutButton) signOutButton.addEventListener("click", signOut);
            if (reloadButton) reloadButton.addEventListener("click", () => win.location.reload());
            if (modal) {
                modal.addEventListener("click", (event) => {
                    if (event.target === modal) closePersonPanel();
                });
            }

            refreshPersonUI();
        }

        if (win.document.readyState === "loading") {
            win.document.addEventListener("DOMContentLoaded", bootUI, { once: true });
        } else {
            bootUI();
        }

        return runtime;
    }

    return {
        createRuntime,
        normalizePersonClaims,
        emptyWorkspace,
        normalizeWorkspace,
        legacyPayload,
        applyLegacyPayload
    };
});
