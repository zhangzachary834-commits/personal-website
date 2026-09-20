import os
import datetime

now = datetime.datetime.now()
date_str = now.strftime("%Y-%m-%d")

content = f"""## {date_str} - Math.hypot Performance Bottleneck
**Learning:** In Javascript, `Math.hypot` is a known performance bottleneck in tight loops (like physics simulations or rendering). Writing out the Euclidean distance manually `Math.sqrt(dx*dx + dy*dy)` results in a significant performance improvement due to the overhead of variable arguments parsing and internal safety checks inside `Math.hypot`.
**Action:** When working on physics or rendering loops on the web, always prefer explicit `Math.sqrt(dx * dx + dy * dy)` over `Math.hypot(dx, dy)`.
"""

if not os.path.exists(".jules"):
    os.makedirs(".jules")

with open(".jules/bolt.md", "a") as f:
    f.write(content)
