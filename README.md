# Zachary Zhang — Personal Portfolio & Dimension of Thought

> *"Software that represents beings as they actually are."*  
> *"The internet is many scattered stars. Dimension of Thought seeks to form the constellation."*

This repository houses the personal website and digital ecosystems created by **Zachary Zhang** (Computer Science & Mathematics). It features a **Dual-Mode Experience** allowing visitors to seamlessly toggle between Zachary's **Personal/Professional Engineering Portfolio** and the **Dimension of Thought Philosophical Platform**.

---

## ✧ Dual-Mode Architecture

The top-left navigation bar includes an interactive, glassmorphic **Mode Switcher**:

| Mode | Purpose & Focus Areas | Sections / Pages |
| :--- | :--- | :--- |
| **👤 Zachary Zhang** *(Personal Portfolio)* | Systems architecture, robotics, software research, and engineering background. | **Home**, **Now** (active projects), **Earthcall** (substrate architecture), **Projects** (Robotics VLA, SAT collision, TeacherOps), **About** (principles), **Skills** (C++20, WebGPU, Python, etc.), **Contact**. |
| **✧ Dimension of Thought** *(Holistic Platform)* | Holistic digital space, moral ontology, dynamic storytelling, and writing collaboration. | **Home** (Constellation canvas & emblem showcase), **Story** (`story.html`), **Manifesto** (`manifesto.html`), **The Library** (`library.html` + standalone essays), **Ecosystem** (`ecosystem.html`), **Dialogue** (`contact.html`). |

* **State Persistence**: Switching modes automatically saves your preference to `localStorage.getItem("dimension-site-mode")`.
* **Direct URL Routing**: Open either mode directly using URL parameters:
  * `http://localhost:8000/?mode=personal`
  * `http://localhost:8000/?mode=dimension`

---

## ✧ Essential Commands & Controls

### 1. Launching & Restarting

* **Finder 1-Click Launch / Restart**:
  * Double-click **`restart-server.command`** in Finder to terminate any previous server running strictly on port 8000 and start a fresh server.
* **Terminal**:
  ```bash
  cd ~/Documents/personal-website
  python3 -m http.server 8000
  ```
  Then visit [http://localhost:8000](http://localhost:8000).

### 2. Browser Refresh Shortcuts

* **Hard Refresh (Bypass Cache)**: `Cmd + Shift + R` (Chrome/Firefox/Brave) or `Option + Cmd + E` then `Cmd + R` (Safari).
* **Reset Local State**: In browser Console (`Cmd + Option + I`):
  ```javascript
  localStorage.clear(); location.reload();
  ```

### 3. Interactive In-Browser CLI (`>_`)

Press `` ` `` (backtick / tilde) or click **`>_ CLI`** in the navigation bar:

* `mode <personal|dimension>` — Switch site modes dynamically.
* `earthcall` — Overview of the C++20 / WebGPU computational ontology.
* `projects` — Selected robotics, systems, and operations projects.
* `about` — Zachary Zhang bio and 3 core system principles.
* `essays` — List all essays in the Library archive.
* `read <id>` — Open an essay page (e.g. `read valley`, `read persons`, `read sadako`).
* `manifesto` — Constitutional Manifesto & axioms.
* `theme` — Toggle dark/light theme.
* `clear` / `exit` — Clear or close the terminal.

---

&copy; 2026 Zachary Zhang · Dimension of Thought. All rights reserved.
