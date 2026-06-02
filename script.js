const starCanvas = document.getElementById('starCanvas');
const sCtx       = starCanvas.getContext('2d');
let sW, sH;

function resizeStars() {
  sW = starCanvas.width  = window.innerWidth;
  sH = starCanvas.height = window.innerHeight;
}
resizeStars();
window.addEventListener('resize', resizeStars);

const STAR_COUNT = 160;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  bx:    Math.random(),
  by:    Math.random(),
  r:     0.4 + Math.random() * 2,
  op:    0.25 + Math.random() * 0.65,
  phase: Math.random() * Math.PI * 2,
  speed: 0.4 + Math.random() * 1.2,
  depth: 0.02 + Math.random() * 0.12
}));

let mouseX = sW / 2, mouseY = sH / 2;
let smoothX = sW / 2, smoothY = sH / 2;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
document.addEventListener('touchmove', e => {
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
}, { passive: true });

let starT = 0;
function drawStars() {
  starT += 0.016;
  smoothX += (mouseX - smoothX) * 0.06;
  smoothY += (mouseY - smoothY) * 0.06;

  const ox = (smoothX / sW) - 0.5;
  const oy = (smoothY / sH) - 0.5;

  sCtx.clearRect(0, 0, sW, sH);

  stars.forEach(s => {
    const shiftX = ox * sW * s.depth * 2.5;
    const shiftY = oy * sH * s.depth * 2.5;
    const x = (s.bx * sW + shiftX + sW) % sW;
    const y = (s.by * sH + shiftY + sH) % sH;
    const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(starT * s.speed + s.phase));
    const alpha   = s.op * twinkle;

    sCtx.beginPath();
    sCtx.arc(x, y, s.r * twinkle, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(255,255,255,${alpha})`;
    sCtx.fill();
  });

  requestAnimationFrame(drawStars);
}
drawStars();


// ── SHOOTING STARS ──────────────────────────────────────────────────────────
function shootingStar() {
  const el = document.createElement('div');
  el.className = 'shooting-star';
  el.style.cssText = `top:${Math.random()*45}%;left:${Math.random()*55}%;animation:shoot ${1.1+Math.random()*0.9}s ease-out forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}
shootingStar();
setInterval(shootingStar, 4000 + Math.random() * 3000);


// ── CURSOR GLOW ─────────────────────────────────────────────────────────────
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});


// ── CLICK SPARKS ────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const colors = ['#a78bff','#60c8ff','#ff7eb3','#fff','#7dd3fc','#c4b5fd'];
  for (let i = 0; i < 14; i++) {
    const sp    = document.createElement('div');
    sp.className = 'spark';
    const sz    = 4 + Math.random() * 6;
    const angle = (Math.PI * 2 / 14) * i + Math.random() * 0.3;
    const dist  = 40 + Math.random() * 70;
    sp.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${e.clientX}px; top:${e.clientY}px;
      background:${colors[i % colors.length]};
      box-shadow:0 0 ${sz*2}px ${colors[i % colors.length]};
      --sx:${Math.cos(angle)*dist}px;
      --sy:${Math.sin(angle)*dist}px;
      --sd:${0.5+Math.random()*0.4}s;
    `;
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 900);
  }
});


// ── FLOATING PARTICLES around photo ─────────────────────────────────────────
const wrap    = document.getElementById('photoWrap');
const pColors = [
  'rgba(150,140,255,0.75)',
  'rgba(80,200,255,0.65)',
  'rgba(220,150,255,0.65)',
  'rgba(100,220,200,0.6)'
];
for (let i = 0; i < 8; i++) {
  const p  = document.createElement('div');
  p.className = 'particle';
  const sz = 3 + Math.random() * 6;
  p.style.cssText = `
    width:${sz}px; height:${sz}px;
    background:${pColors[i % pColors.length]};
    top:${8 + Math.random()*84}%;
    left:${Math.random() > 0.5 ? 102+Math.random()*4 : -6-Math.random()*4}%;
    --pd:${3+Math.random()*4}s;
    --pdelay:-${Math.random()*5}s;
    --pop:${0.45+Math.random()*0.45};
    box-shadow:0 0 ${sz*2.5}px ${pColors[i % pColors.length]};
  `;
  wrap.appendChild(p);
}


// ── 3D PHOTO TILT ───────────────────────────────────────────────────────────
const photoOuter = document.getElementById('photoOuter');
const photoImg   = document.getElementById('photoImg');

photoOuter.style.transition = 'transform 0.18s ease, background 2s linear';

wrap.addEventListener('mousemove', e => {
  const r = wrap.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width  - 0.5;
  const y = (e.clientY - r.top)  / r.height - 0.5;
  photoOuter.style.transform = `perspective(700px) rotateY(${x*16}deg) rotateX(${-y*16}deg) scale(1.03)`;
  photoImg.style.filter = 'brightness(1.08) contrast(1.04) saturate(1.1)';
});
wrap.addEventListener('mouseleave', () => {
  photoOuter.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
  photoImg.style.filter = 'brightness(1.04) contrast(1.03) saturate(1.05)';
});


// ── NEURAL NETWORK ──────────────────────────────────────────────────────────
const canvas = document.getElementById('neural');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Node {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = 1.5 + Math.random() * 2;
    this.op = 0.2  + Math.random() * 0.5;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
}

const nodes = Array.from({ length: 55 }, () => new Node());

function drawNeural() {
  ctx.clearRect(0, 0, W, H);
  nodes.forEach(n => n.update());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx   = nodes[i].x - nodes[j].x;
      const dy   = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.18;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(120,110,255,${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(140,130,255,${nodes[i].op * 0.55})`;
    ctx.fill();
  }

  requestAnimationFrame(drawNeural);
}
drawNeural();
