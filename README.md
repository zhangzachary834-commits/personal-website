# Zachary Zhang — Personal Portfolio & Dimension of Thought

> *"Software that represents beings as they actually are."*  
> *"The internet is many scattered stars. Dimension of Thought seeks to form the constellation."*

This repository houses the personal website and digital ecosystems created by **Zachary Zhang** (Computer Science & Mathematics). It features a **Dual-Mode Experience** allowing visitors to seamlessly toggle between Zachary's **Personal/Professional Engineering Portfolio** and the **Dimension of Thought Philosophical Platform**.

## Live site

The current GitHub Pages deployment is:

**https://zhangzachary834-commits.github.io/personal-website/**

The deployment base URL is intentionally centralized in `site.config.json`. When the site later migrates to `thedimensionofthought.com`, update that file and run `npm run sync-metadata` rather than hand-editing canonical/OpenGraph URLs throughout the site.

---

## ✧ Dual-Mode Architecture

The top-left navigation bar includes an interactive, glassmorphic **Mode Switcher**:

| Mode | Purpose & Focus Areas | Sections / Pages |
| :--- | :--- | :--- |
| **👤 Zachary Zhang** *(Personal Portfolio)* | Systems architecture, robotics, software research, and engineering background. | **Home**, **Now** (active projects), **Earthcall** (substrate architecture), **Projects** (Robotics VLA, SAT collision, TeacherOps), **About** (principles), **Skills** (C++20, WebGPU, Python, etc.), **Contact**. |
| **✧ Dimension of Thought** *(Holistic Platform)* | Holistic digital space, moral ontology, dynamic storytelling, and writing collaboration. | **Home** (Constellation canvas & emblem showcase), **Story** (`story.html`), **Manifesto** (`manifesto.html`), **The Library** (`library.html` + standalone essays), **Ecosystem** (`ecosystem.html`), **Dialogue** (`contact.html`). |

* **State Persistence**: Switching modes automatically saves your preference to `localStorage.getItem("dimension-site-mode")`.
* **Direct URL Routing**:
  * `http://localhost:8000/?mode=personal`
  * `http://localhost:8000/?mode=dimension`

---

## ✧ Development and integrity checks

Install dependencies once with:

```bash
npm ci
```

Run the existing unit tests:

```bash
npm test
```

Run the static-site audit, which checks local references, duplicate IDs, required metadata, canonical URLs, image accessibility metadata, CSS asset references, and accidentally tracked generated files:

```bash
npm run audit
```

Run the full local gate:

```bash
npm run check
```

Synchronize canonical URLs, OpenGraph URLs, the social image URL, `robots.txt`, and `sitemap.xml` from `site.config.json`:

```bash
npm run sync-metadata
```

GitHub Actions runs the same quality gate on pushes and pull requests and also fails if generated metadata has drifted from `site.config.json`.

---

## ✧ Launching locally

### Finder 1-click launch / restart

Double-click **`launch.command`** in Finder to terminate any previous server running strictly on port 8000 and start a fresh server.

### Terminal

```bash
cd ~/Documents/GitHub/personal-website
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

### Browser refresh shortcuts

* **Hard Refresh (Bypass Cache)**: `Cmd + Shift + R` (Chrome/Firefox/Brave) or `Option + Cmd + E` then `Cmd + R` (Safari).
* **Reset Local State**: In browser Console (`Cmd + Option + I`):

```javascript
localStorage.clear(); location.reload();
```

---

## ✧ Interactive In-Browser CLI (`>_`)

Press `` ` `` (backtick / tilde) or click **`>_ CLI`** in the navigation bar.

### Systems & Architecture

* `specs` / `neofetch` — Workstation, OS, runtime substrates, robotics hardware, and toolchains.
* `benchmark` / `bench` — Real-time in-browser Float32 Tensor MatMul & 3D SAT collision throughput benchmark.
* `stack` / `arch` — Multi-tier ASCII box architecture diagram (Person to Vessel).
* `tree` / `ontology` — Earthcall source tree hierarchy & architectural refusals.
* `robotics` / `jaka` — OpenVLA-OFT, remote CUDA inference, and RealSense vision pipeline.
* `sat` / `physics` — C++20 Separating Axis Theorem continuous collision detection details.
* `skills` / `tech` — Categorized technical proficiencies matrix.

### Projects & Research

* `projects` — Selected systems, robotics, and operations projects.
* `cat <project>` — Deep-dives (`cat earthcall`, `cat robotics`, `cat sat`, `cat teacherops`, `cat bridge`).
* `now` — What is being built right now in present tense (2026).
* `cv` / `resume` — Research, education, and background CV summary.

### Platform & Essays

* `mode <personal|dimension>` — Switch site modes dynamically.
* `essays` / `read <id>` — List or open essays from The Library.
* `draft` / `studio` / `drafts` — Open or view the local article drafting studio.
* `manifesto` / `story` — Core philosophical texts & origin story.

### Shell Utilities

* `Tab` — Autocomplete command names and arguments.
* `history`, `matrix`, `date`, `echo`, `sudo`, `theme`, `clear`, `exit`.

---

## ✧ Repository hygiene

Generated dependencies and machine-specific files are intentionally excluded from version control. Historical source is preserved by Git itself rather than by maintaining a duplicate `backup/` tree. One-off performance comparison scripts live under `tools/perf/`; production files remain at the repository root and under `posts/`, `assets/`, `scripts/`, and `tests/`.

&copy; 2026 Zachary Zhang · Dimension of Thought. All rights reserved.
