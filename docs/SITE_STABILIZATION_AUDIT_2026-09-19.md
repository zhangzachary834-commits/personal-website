# Personal Website Stabilization Audit — 2026-09-19

**Repository:** `zhangzachary834-commits/personal-website`  
**Audit branch:** `sol/site-stabilization-audit-v2-20260919`  
**Auditor / implementer:** GPT-5.6 Sol (OpenAI)  
**Deployment target during this audit:** `https://zhangzachary834-commits.github.io/personal-website/`

## Executive summary

The site was already visually substantial and GitHub Pages itself was functioning, but the repository had accumulated several classes of loose ends from rapid multi-agent development: deployment metadata drift, generated files committed to Git, duplicated and unused assets, one-off repair scripts, incomplete quality gates, misleading Studio publishing semantics, and unsafe browser-local HTML rendering.

The most serious correctness finding was not cosmetic: a recent hardening merge removed the implementations of `parseMarkdown()` and `slugify()` from `script.js` while leaving their exports and call sites intact. This made the article Studio depend on functions that no longer existed. The stabilization branch restores both functions and adds regression coverage so this class of merge regression becomes CI-visible.

A first audit branch was intentionally abandoned after current `main` advanced by dozens of legitimate portfolio and Earthcall commits. Rather than PR a stale branch and risk reverting newer work, this v2 branch was created directly from the new `main` and the fixes were reapplied as narrow transformations. The newer Earthcall Law Execution Explorer, live bridge, portfolio evidence sections, and Jules performance work are preserved.

## Findings and implemented fixes

### 1. GitHub Pages deployment metadata was inconsistent

The repository is currently a GitHub Pages project site, so its canonical base is:

`https://zhangzachary834-commits.github.io/personal-website/`

Several pages still advertised root-account URLs such as `https://zhangzachary834-commits.github.io/story.html`, which are incorrect for a project site. OpenGraph URLs had the same problem.

Implemented:

- Added `site.config.json` as the single deployment-base source of truth.
- Added `scripts/sync-site-metadata.js`.
- Canonical URLs and `og:url` are generated from the project-site base.
- `og:image` is generated as an absolute public URL.
- `sitemap.xml` and `robots.txt` are generated from the same configuration.
- `studio.html` and `404.html` are marked `noindex, nofollow`.
- The generated standalone-essay canonical URL is synchronized to the same project base.
- The stale contact footer string `zacharyzhang.dev` is normalized to “Dimension of Thought”.

When the real domain `thedimensionofthought.com` is eventually migrated away from Wix, the intended migration path is to update the single `baseUrl` in `site.config.json`, run `npm run sync-metadata`, verify DNS/Pages, and review the generated diff.

### 2. A recent merge deleted the Studio parser and slugifier

Commit history showed that the PR #17 escapeHtml hardening resolution replaced a large opening region of `script.js`. In that replacement, it unintentionally removed:

- `parseMarkdown()`
- `slugify()`

while retaining:

- `module.exports = { slugify, parseMarkdown, escapeHtml }`
- Studio call sites that use both functions
- the existing parser/slug tests

This was a silent merge-regression shape that the repository had no CI workflow to catch.

Implemented:

- Restored `parseMarkdown()`.
- Restored `slugify()`.
- Preserved the newer null-safe `escapeHtml()`.
- Added `escapeAttribute()` and URL-scheme filtering.
- Raw authored HTML is escaped rather than injected.
- `javascript:`, `vbscript:`, and `data:` Markdown URLs are rejected.
- The explicitly supported drop-cap construct remains available.
- Existing Markdown behavior (headings, emphasis, code, blockquotes, lists, tables, checkboxes, images, wiki links) is covered by tests.
- Added security regressions for raw HTML, executable URL schemes, safe URLs, and attribute-breaking wiki-link text.

### 3. Browser-local article metadata could reach innerHTML unsafely

The Library dynamically reconstructs locally saved “published” articles from `localStorage`. Article title, subtitle, excerpt, author, and related data were interpolated into `innerHTML`.

A malformed or imported local draft could therefore become markup instead of text.

Implemented:

- Escape locally stored article text before inserting it into card templates.
- Sanitize generated hrefs.
- Escape draft drawer title/category metadata.
- Escape graph-tooltip metadata derived from dynamic article nodes.
- Added a jsdom regression that stores deliberately hostile markup in `localStorage`, boots the Library, and verifies:
  - the title is rendered literally as text,
  - no injected image/script element appears,
  - no injected handler executes,
  - the resulting navigation URL is the intended Studio URL.

### 4. “Publish to Library” did not actually publish to GitHub Pages

The Studio button labeled “Publish to Library” did not publish a file to the repository or internet. Its actual behavior was:

1. mark the draft published in that browser’s `localStorage`,
2. create standalone HTML,
3. save/download the HTML file locally.

Additionally, the Library generated `posts/<slug>.html` links for these browser-local articles even though no such repository file necessarily existed, producing a potential 404.

Implemented:

- Renamed the surface to **Save + Export**.
- Updated title/toast/error copy to describe browser-local persistence and HTML export accurately.
- Browser-local Library cards now reopen the corresponding draft with `studio.html?load=<draft-id>` instead of pretending a committed static post exists.
- Existing committed articles in `posts/` remain normal static Pages content.

True one-click publication to GitHub is intentionally not implemented in the public browser client because that would require an authenticated write path and careful credential/security design.

### 5. Generated dependencies and machine artifacts were committed

The repository contained the full `node_modules/` tree and `.DS_Store`.

Implemented:

- Removed tracked `node_modules/`.
- Removed tracked `.DS_Store`.
- Added `.gitignore` rules so these do not return.
- Dependencies are reconstructed with `npm ci` from `package-lock.json`.

This significantly reduces repository noise and prevents dependency snapshots from being mistaken for authored source.

### 6. Redundant historical/repair artifacts were living beside production source

The repo contained:

- a duplicate `backup/` source tree,
- `fix_parser.py`, a one-off machine-specific repair script with an absolute local filesystem path,
- legacy root benchmark scratch files.

Implemented:

- Removed `backup/`; Git history is the canonical source history.
- Removed `fix_parser.py`.
- Preserved the two legacy benchmark comparison scripts under `tools/perf/`.
- Preserved the newer Jules benchmark files under `benchmarks/`; they are current engineering artifacts, not cleanup targets.

### 7. Asset directory contained duplication and a large dead asset

Findings:

- `favicon.jpg` and `dimension-emblem.jpg` were byte-identical.
- `cosmic-bg.jpg` was 856.3 KiB and had no source reference.

Implemented:

- All favicon references now reuse `dimension-emblem.jpg`.
- Removed duplicate `favicon.jpg`.
- Removed verified-unused `cosmic-bg.jpg`.
- Added `scripts/audit-assets.js` to detect unused assets and duplicate content.

After cleanup, the asset audit reports only:

- `dimension-emblem.jpg` — used.

### 8. The local launcher used a brittle restart sequence

The old `launch.command`:

- force-killed the process on port 8000 with `kill -9`,
- opened the browser before starting the new server,
- did not own/clean up its child server process explicitly.

Implemented:

- graceful stop first,
- short wait and forced stop only as fallback,
- start server before opening the browser,
- verify that the server process survived startup,
- trap exit/interrupt and clean up the spawned process,
- corrected README instructions to reference the real file name, `launch.command`.

### 9. There was no permanent repository quality gate

Added `.github/workflows/site-quality.yml` using Node 24 and current `actions/checkout@v7` / `actions/setup-node@v7`.

The gate performs:

1. `npm ci`
2. `npm test`
3. metadata regeneration followed by `git diff --exit-code`
4. structural site audit
5. asset audit

The structural audit checks:

- HTML `lang`,
- viewport metadata,
- titles,
- descriptions,
- duplicate IDs,
- broken local href/src references,
- image alt attributes,
- `target="_blank"` noopener hygiene,
- canonical URLs,
- OpenGraph URLs,
- stale deployment-domain strings,
- CSS local asset references,
- accidentally tracked `.DS_Store`,
- accidentally tracked `node_modules`.

The DOM smoke suite boots the shared client script against the major site surfaces, including the article Studio and a nested post.

## Verified quality-gate result

The verified cleanup run completed with:

- **42 tests**
- **42 passed**
- **0 failed**
- **18 HTML files audited**
- **0 structural errors**
- **0 structural warnings**
- **17 public HTML pages synchronized into deployment metadata**
- **0 npm vulnerabilities**
- **1 remaining image asset, referenced and live**

The cleanup itself was committed only after that full working-tree gate passed.

## Live Earthcall bridge review

The current portfolio includes a read-only live bridge from the public website to a locally running Earthcall projection at:

`http://127.0.0.1:5005/api/portfolio/live`

The code already has an important correctness property: failure to contact the bridge falls back to the ontology-faithful offline demo rather than breaking the portfolio.

Newer browser Local Network Access policies may require user permission for a public HTTPS page to reach a loopback service. The request now includes `targetAddressSpace: "loopback"` as a progressive compatibility hint for browsers that support the API; the timeout/demo fallback remains the cross-browser floor.

The local Python bridge must continue to opt into appropriate CORS behavior. No write controls are exposed through this portfolio endpoint by this audit.

## Deliberately unresolved / future work

These are not blockers for the GitHub Pages deployment:

1. **Custom-domain cutover.** `thedimensionofthought.com` remains on Wix for now. Do not add a Pages `CNAME` until its DNS is intentionally migrated.
2. **Repository homepage metadata.** GitHub’s repository “homepage” field previously advertised `zachsdimension.com`. The available connector does not expose the repository-settings update endpoint; update this manually in the GitHub repo sidebar/settings to the current Pages URL, or later to `thedimensionofthought.com`.
3. **Studio internet publishing.** The Studio is intentionally browser-local + export-only after this audit. A real GitHub publishing path would need an authenticated backend/connector workflow rather than embedding repository credentials in frontend JavaScript.
4. **Real-browser performance/accessibility measurement.** CI now provides structural and jsdom runtime coverage, but it is not a substitute for Lighthouse, VoiceOver/NVDA, Safari/Firefox/Chrome interaction testing, or visual-regression screenshots.
5. **Loopback browser permissions.** Live Earthcall mode is necessarily browser-policy-dependent when launched from a public HTTPS origin. Offline/demo mode remains available when permission/CORS/local service availability prevents the connection.

## Safety note on branch history

An earlier audit branch was intentionally not proposed for merge after `main` advanced substantially with newer Earthcall portfolio and performance work. This v2 branch was recreated from the then-current `main` and fixes were reapplied narrowly. This avoids using a stale cleanup branch as an accidental temporal rollback.

---

**Signed:** GPT-5.6 Sol — OpenAI  
**Role in this pass:** code auditor, stabilization implementer, and CI witness
