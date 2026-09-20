const { performance } = require('perf_hooks');

// Mock canvas and ctx
const canvas = { width: 800, height: 600 };
const ctx = {
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fillRect: () => {},
    arc: () => {},
    fill: () => {},
    fillText: () => {}
};

let nodes = [];
for (let i = 0; i < 500; i++) {
    nodes.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        mass: Math.floor(Math.random() * 8) + 10,
        charge: Math.random() > 0.5 ? 1.0 : -1.0,
        name: `Being:${i}`
    });
}

const activeLaws = { gravity: true, resonance: true, damping: true };
let draggedNode = null;

function updatePhysics() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 1;

            if (activeLaws.gravity && dist > 20) {
                const force = ((a.mass * b.mass) / (dist * dist)) * 0.09;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                a.vx += fx / a.mass;
                a.vy += fy / a.mass;
                b.vx -= fx / b.mass;
                b.vy -= fy / b.mass;
            }

            if (activeLaws.resonance && dist < 140) {
                const rep = (140 - dist) * 0.0035 * (a.charge * b.charge);
                a.vx -= (dx / dist) * rep;
                a.vy -= (dy / dist) * rep;
                b.vx += (dx / dist) * rep;
                b.vy += (dy / dist) * rep;
            }
        }
    }

    nodes.forEach(n => {
        if (n === draggedNode) return;
        if (activeLaws.damping) {
            n.vx *= 0.985;
            n.vy *= 0.985;
        }
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 35) { n.x = 35; n.vx *= -0.7; }
        if (n.x > canvas.width - 35) { n.x = canvas.width - 35; n.vx *= -0.7; }
        if (n.y < 35) { n.y = 35; n.vy *= -0.7; }
        if (n.y > canvas.height - 35) { n.y = canvas.height - 35; n.vy *= -0.7; }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePhysics();

    for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dist = Math.hypot(b.x - a.x, b.y - a.y);
            if (dist < 220) {
                const alpha = (1 - dist / 220) * 0.45;
                ctx.strokeStyle = `rgba(110, 231, 216, ${alpha})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();

                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                ctx.fillStyle = `rgba(216, 180, 110, ${alpha * 0.7})`;
                ctx.fillRect(mx - 2, my - 2, 4, 4);
            }
        }
    }

    nodes.forEach(n => {
        ctx.fillStyle = n.charge > 0 ? "rgba(216, 180, 110, 0.3)" : "rgba(110, 231, 216, 0.3)";
        ctx.strokeStyle = n.charge > 0 ? "#d8b46e" : "#6ee7d8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.mass, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "10px monospace";
        ctx.fillText(n.name, n.x - 28, n.y - n.mass - 4);
    });
}

// Warmup
for (let i = 0; i < 10; i++) draw();

const start = performance.now();
for (let i = 0; i < 50; i++) draw();
const end = performance.now();

console.log(`Baseline time: ${(end - start).toFixed(2)} ms for 50 frames with 500 nodes`);
