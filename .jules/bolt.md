## 2026-08-15 - Canvas Animation Loop Distance Calculation Optimization
**Learning:** `Math.hypot(dx, dy)` is significantly slower in JS engine execution than `Math.sqrt(dx * dx + dy * dy)` due to internal argument handling and overflow protections. In high-frequency rendering and physics loops (like `drawConstellation` and `renderConnections` in `script.js`), this causes a measurable performance bottleneck. Furthermore, when comparing against thresholds, using squared distances (`distSq < threshold * threshold`) entirely avoids the `Math.sqrt()` call.
**Action:** When performing 2D distance calculations in hot loops, always prefer `Math.sqrt(dx * dx + dy * dy)` over `Math.hypot`. Whenever possible, use squared distance comparisons to skip the square root operation entirely.
## 2026-08-16 - Layout Thrashing in Animation Loop
**Learning:** `canvas.getBoundingClientRect()` causes layout thrashing and is very expensive when called 60 times a second inside a `requestAnimationFrame` loop like `drawConstellation`.
**Action:** Cache the result of `getBoundingClientRect()` inside a variable and update it only when necessary (e.g. on window resize or scroll).
## 2026-09-20 - Spatial Grid String Allocation Bottleneck
**Learning:** Constructing string keys (e.g., `cx + "," + cy`) inside high-frequency (N)$ nested loops for spatial grids causes significant string allocation overhead and makes map lookups slow. Using `parseInt` to unpack them later compounds the issue.
**Action:** Use fixed-width integer packing (e.g., `cx + cy * 10000`) for spatial grid keys instead of string concatenation to eliminate allocation overhead and bypass string parsing completely.
## 2026-09-21 - Spatial Grid Neighbor Offset Optimization
**Learning:** Even when using fixed-width integer packing for spatial grid keys (e.g., `key = (cx + 5000) + (cy + 5000) * 10000`), extracting `cx` and `cy` from the `key` and repacking them in the inner loop to find neighbors is computationally wasteful.
**Action:** Since the map keys correspond directly to integer grids, neighbor grid cells can be accessed directly using static numerical offsets applied to the current cell's `key` (e.g., `key + 1`, `key + 10000`), eliminating inner loop coordinate extraction and parsing entirely.
