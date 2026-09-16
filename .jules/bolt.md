## 2024-05-24 - Duplicate DOM Event Listeners & Thrashing

**Learning:** This vanilla JS architecture is susceptible to layout thrashing and compounding event listeners because initialization functions (`initCardSpotlights()`) are sometimes called multiple times dynamically (e.g., when adding new custom articles). Furthermore, scroll handlers routinely query the DOM using `querySelectorAll` causing high CPU load.
**Action:** Always add an idempotency guard (like checking for a custom `_hasListener` property) before binding events in dynamic init functions, and aggressively cache static NodeLists accessed in high-frequency event handlers like `scroll`.
