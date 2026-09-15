// ---------- UMAP-inspired animated dot underlay ----------

const canvas = document.getElementById('umap-underlay');
const ctx = canvas.getContext('2d');

// colors chosen to complement the site's green/grey/black palette —
// each cluster gets one color, like coloring UMAP points by cell type
const CLUSTER_COLORS = [
  'rgba(180, 101, 74, 0.5)',   // dusty clay
  'rgba(201, 154, 61, 0.5)',   // muted ochre
  'rgba(76, 107, 138, 0.5)',   // slate blue
  'rgba(62, 128, 115, 0.5)',   // muted teal
  'rgba(125, 90, 114, 0.5)',   // dusty plum
  'rgba(53, 94, 69, 0.5)'      // moss green (matches site accent)
];

const CLUSTER_COUNT = 12;
const POINTS_PER_CLUSTER = 35;
const CLUSTER_SPREAD = 40;       // how tightly points scatter around a cluster center
const DOT_MIN_RADIUS = 2;
const DOT_MAX_RADIUS = 5;

const MOUSE_INFLUENCE_RADIUS = 130; // how close the mouse needs to be to push a dot
const MAX_PUSH_DISTANCE = 55;       // how far a dot can be pushed away
const EASE = 0.08;                  // how quickly dots move toward their target each frame

let dots = [];
let width, height;
const mouse = { x: -9999, y: -9999 };

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

// simple gaussian-ish random offset using the Box-Muller transform
function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateDots() {
  dots = [];
  for (let c = 0; c < CLUSTER_COUNT; c++) {
    const centerX = Math.random() * width;
    const centerY = Math.random() * height;
    const color = CLUSTER_COLORS[c % CLUSTER_COLORS.length];

    for (let p = 0; p < POINTS_PER_CLUSTER; p++) {
      const homeX = centerX + gaussianRandom() * CLUSTER_SPREAD;
      const homeY = centerY + gaussianRandom() * CLUSTER_SPREAD;

      dots.push({
        homeX,
        homeY,
        x: homeX,
        y: homeY,
        radius: DOT_MIN_RADIUS + Math.random() * (DOT_MAX_RADIUS - DOT_MIN_RADIUS),
        color
      });
    }
  }
}

function updateDots() {
  for (const dot of dots) {
    const dx = dot.homeX - mouse.x;
    const dy = dot.homeY - mouse.y;
    const dist = Math.hypot(dx, dy);

    let targetX = dot.homeX;
    let targetY = dot.homeY;

    if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0.001) {
      const force = (MOUSE_INFLUENCE_RADIUS - dist) / MOUSE_INFLUENCE_RADIUS;
      const pushX = (dx / dist) * force * MAX_PUSH_DISTANCE;
      const pushY = (dy / dist) * force * MAX_PUSH_DISTANCE;
      targetX = dot.homeX + pushX;
      targetY = dot.homeY + pushY;
    }

    dot.x += (targetX - dot.x) * EASE;
    dot.y += (targetY - dot.y) * EASE;
  }
}

function drawDots() {
  ctx.clearRect(0, 0, width, height);
  for (const dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = dot.color;
    ctx.fill();
  }
}

function animate() {
  updateDots();
  drawDots();
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    generateDots();
  }, 200);
});

resizeCanvas();
generateDots();
animate();