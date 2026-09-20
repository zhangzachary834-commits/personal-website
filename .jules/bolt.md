## 2026-08-15 - Canvas Animation Loop Distance Calculation Optimization
**Learning:** `Math.hypot(dx, dy)` is significantly slower in JS engine execution than `Math.sqrt(dx * dx + dy * dy)` due to internal argument handling and overflow protections. In high-frequency rendering and physics loops (like `drawConstellation` and `renderConnections` in `script.js`), this causes a measurable performance bottleneck. Furthermore, when comparing against thresholds, using squared distances (`distSq < threshold * threshold`) entirely avoids the `Math.sqrt()` call.
**Action:** When performing 2D distance calculations in hot loops, always prefer `Math.sqrt(dx * dx + dy * dy)` over `Math.hypot`. Whenever possible, use squared distance comparisons to skip the square root operation entirely.
## 2026-08-16 - Layout Thrashing in Animation Loop
**Learning:** `canvas.getBoundingClientRect()` causes layout thrashing and is very expensive when called 60 times a second inside a `requestAnimationFrame` loop like `drawConstellation`.
**Action:** Cache the result of `getBoundingClientRect()` inside a variable and update it only when necessary (e.g. on window resize or scroll).
## 2026-09-20 - Math.hypot Performance Bottleneck
**Learning:** In Javascript, `Math.hypot` is a known performance bottleneck in tight loops (like physics simulations or rendering). Writing out the Euclidean distance manually `Math.sqrt(dx*dx + dy*dy)` results in a significant performance improvement due to the overhead of variable arguments parsing and internal safety checks inside `Math.hypot`.
**Action:** When working on physics or rendering loops on the web, always prefer explicit `Math.sqrt(dx * dx + dy * dy)` over `Math.hypot(dx, dy)`.
