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
## 2026-10-25 - Avoid Array Allocations in High-Frequency Spatial Grid Loops
**Learning:** Allocating an array of `neighborKeys` inside the inner loop of `grid.entries()` for spatial grids (like `drawConstellation` or `simulate` running at 60 FPS) generates significant garbage collection overhead, allocating tens of thousands of short-lived arrays per second.
**Action:** Extract inline array allocations for neighbor offsets (e.g., `[-10001, -10000, -9999, -1, 0, 1, 9999, 10000, 10001]`) outside the loop and reuse the static array, adding the offset to the `key` during iteration (`key + neighborOffsets[nIdx]`). This completely eliminates inner-loop array allocations.
## 2024-05-19 - Spatial Grid Pairwise Lookup Optimization
**Learning:** Checking all 9 neighboring cells in a spatial grid for pairwise distance calculations performs redundant symmetric calculations.
**Action:** Use a "half-kernel" of 5 neighbor checks (`[0, 1, 9999, 10000, 10001]`) and start the inner loop index offset at `idx + 1` for the self-cell (`nIdx === 0`) to accurately compute pairs in roughly half the time.
