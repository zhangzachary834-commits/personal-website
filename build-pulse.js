(() => {
    "use strict";

    const REPOSITORIES = [
        {
            id: "earthcall",
            label: "Earthcall",
            repo: "Earthcall",
            branch: "sync-from-earthcall-main",
            url: "https://github.com/zhangzachary834-commits/Earthcall"
        },
        {
            id: "site",
            label: "Personal site",
            repo: "personal-website",
            branch: "main",
            url: "https://github.com/zhangzachary834-commits/personal-website"
        }
    ];

    const OWNER = "zhangzachary834-commits";
    const CACHE_TTL_MS = 5 * 60 * 1000;
    const COMMITS_PER_REPO = 6;

    function cacheKey(source) {
        return "dimension-build-pulse-v1:" + source.id;
    }

    function readCache(source) {
        try {
            const raw = sessionStorage.getItem(cacheKey(source));
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.items) || !Number.isFinite(parsed.savedAt)) return null;
            return parsed;
        } catch (_) {
            return null;
        }
    }

    function writeCache(source, items) {
        try {
            sessionStorage.setItem(cacheKey(source), JSON.stringify({
                savedAt: Date.now(),
                items
            }));
        } catch (_) {
            // Storage is an optimization only. The live feed still works without it.
        }
    }

    function normalizeCommit(raw, source) {
        const commit = raw && raw.commit ? raw.commit : {};
        const message = String(commit.message || "Untitled commit").split("\n")[0].trim() || "Untitled commit";
        const date = (commit.author && commit.author.date) ||
            (commit.committer && commit.committer.date) ||
            new Date().toISOString();

        return {
            repoId: source.id,
            repoLabel: source.label,
            repoUrl: source.url,
            sha: String(raw && raw.sha || ""),
            shortSha: String(raw && raw.sha || "").slice(0, 7),
            message,
            date,
            url: String(raw && raw.html_url || source.url)
        };
    }

    async function fetchRepository(source, forceRefresh) {
        const cached = readCache(source);
        if (!forceRefresh && cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
            return { source, items: cached.items, cached: true };
        }

        const endpoint =
            "https://api.github.com/repos/" + OWNER + "/" + source.repo +
            "/commits?sha=" + encodeURIComponent(source.branch) +
            "&per_page=" + COMMITS_PER_REPO;

        try {
            const response = await fetch(endpoint, {
                cache: "no-store",
                headers: {
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            });

            if (!response.ok) {
                throw new Error("GitHub API returned " + response.status);
            }

            const payload = await response.json();
            if (!Array.isArray(payload)) {
                throw new Error("Unexpected GitHub response");
            }

            const items = payload.map(item => normalizeCommit(item, source));
            writeCache(source, items);
            return { source, items, cached: false };
        } catch (error) {
            if (cached && cached.items.length) {
                return { source, items: cached.items, cached: true, stale: true, error };
            }
            throw error;
        }
    }

    function relativeTime(isoDate) {
        const timestamp = Date.parse(isoDate);
        if (!Number.isFinite(timestamp)) return "recently";

        const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
        if (seconds < 45) return "just now";
        if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
        if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
        if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";

        return new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric"
        }).format(new Date(timestamp));
    }

    function createCommitCard(item) {
        const article = document.createElement("article");
        article.className = "build-pulse-item";
        article.dataset.repo = item.repoId;

        const rail = document.createElement("div");
        rail.className = "build-pulse-rail";
        rail.setAttribute("aria-hidden", "true");

        const dot = document.createElement("span");
        dot.className = "build-pulse-node";
        rail.appendChild(dot);

        const body = document.createElement("div");
        body.className = "build-pulse-item-body";

        const top = document.createElement("div");
        top.className = "build-pulse-item-top";

        const repo = document.createElement("a");
        repo.className = "build-pulse-repo";
        repo.href = item.repoUrl;
        repo.target = "_blank";
        repo.rel = "noopener noreferrer";
        repo.textContent = item.repoLabel;

        const time = document.createElement("time");
        time.className = "build-pulse-time";
        time.dateTime = item.date;
        time.title = new Date(item.date).toLocaleString();
        time.textContent = relativeTime(item.date);

        top.append(repo, time);

        const message = document.createElement("a");
        message.className = "build-pulse-message";
        message.href = item.url;
        message.target = "_blank";
        message.rel = "noopener noreferrer";
        message.textContent = item.message;

        const meta = document.createElement("div");
        meta.className = "build-pulse-meta";

        const sha = document.createElement("code");
        sha.textContent = item.shortSha || "commit";

        const linkLabel = document.createElement("span");
        linkLabel.textContent = "Open commit ↗";

        meta.append(sha, linkLabel);
        body.append(top, message, meta);
        article.append(rail, body);
        return article;
    }

    function renderFeed(shell) {
        const feed = shell.querySelector("[data-build-pulse-feed]");
        const status = shell.querySelector("[data-build-pulse-status]");
        if (!feed || !status) return;

        const filter = shell.dataset.buildFilter || "all";
        const items = (shell._buildPulseItems || []).filter(item => filter === "all" || item.repoId === filter);

        feed.replaceChildren();
        items.forEach(item => feed.appendChild(createCommitCard(item)));
        feed.setAttribute("aria-busy", "false");

        if (!items.length) {
            const empty = document.createElement("div");
            empty.className = "build-pulse-empty";
            empty.textContent = "No recent commits landed in this lane yet.";
            feed.appendChild(empty);
        }

        const sourceCount = new Set((shell._buildPulseItems || []).map(item => item.repoId)).size;
        const staleSuffix = shell.dataset.buildPulseStale === "true" ? " · cached fallback" : "";
        status.textContent =
            (shell._buildPulseItems || []).length +
            " recent bricks across " + sourceCount +
            (sourceCount === 1 ? " project" : " projects") +
            staleSuffix;
    }

    function renderFallback(shell) {
        const feed = shell.querySelector("[data-build-pulse-feed]");
        const status = shell.querySelector("[data-build-pulse-status]");
        if (!feed || !status) return;

        feed.replaceChildren();
        feed.setAttribute("aria-busy", "false");
        status.textContent = "Live GitHub pulse unavailable right now · repositories remain public";

        REPOSITORIES.forEach(source => {
            const card = document.createElement("a");
            card.className = "build-pulse-fallback-card";
            card.href = source.url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";

            const title = document.createElement("strong");
            title.textContent = source.label;

            const copy = document.createElement("span");
            copy.textContent = "Open the public construction history ↗";

            card.append(title, copy);
            feed.appendChild(card);
        });
    }

    async function loadPulse(shell, forceRefresh) {
        const refreshButton = shell.querySelector("[data-build-refresh]");
        const status = shell.querySelector("[data-build-pulse-status]");
        const feed = shell.querySelector("[data-build-pulse-feed]");

        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.textContent = "Refreshing…";
        }
        if (status) status.textContent = "Reading the public construction site…";
        if (feed) feed.setAttribute("aria-busy", "true");

        const results = await Promise.allSettled(
            REPOSITORIES.map(source => fetchRepository(source, forceRefresh))
        );

        const fulfilled = results
            .filter(result => result.status === "fulfilled")
            .map(result => result.value);

        const items = fulfilled
            .flatMap(result => result.items)
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        shell._buildPulseItems = items;
        shell.dataset.buildPulseStale = fulfilled.some(result => result.stale) ? "true" : "false";

        if (items.length) {
            renderFeed(shell);
        } else {
            renderFallback(shell);
        }

        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = "Refresh pulse ↻";
        }
    }

    function initShell(shell) {
        if (shell.dataset.buildPulseReady === "true") return;
        shell.dataset.buildPulseReady = "true";
        shell.dataset.buildFilter = "all";
        shell._buildPulseItems = [];

        const filterButtons = Array.from(shell.querySelectorAll("[data-build-filter]"));
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                shell.dataset.buildFilter = button.dataset.buildFilter || "all";
                filterButtons.forEach(candidate => {
                    const active = candidate === button;
                    candidate.classList.toggle("active", active);
                    candidate.setAttribute("aria-pressed", String(active));
                });
                renderFeed(shell);
            });
        });

        const refreshButton = shell.querySelector("[data-build-refresh]");
        if (refreshButton) {
            refreshButton.addEventListener("click", () => loadPulse(shell, true));
        }

        loadPulse(shell, false);
    }

    function init() {
        document.querySelectorAll("[data-build-pulse]").forEach(initShell);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();