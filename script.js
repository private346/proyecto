const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const intro = document.getElementById("intro");
const letter = document.getElementById("letter");
const hint = document.querySelector(".hint");
const musica = document.getElementById("musica");


let W = 0;
let H = 0;
let DPR = 1;
let t = 0;
let started = false;

const stars = [];
const dust = [];
const petals = [];
const hearts = [];
const flowers = [];
const bursts = [];
const shootingStars = [];

const TAU = Math.PI * 2;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2.4);

  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * DPR;
  canvas.height = H * DPR;

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  createScene();
}

window.addEventListener("resize", resize);

function random(min, max) {
  return min + Math.random() * (max - min);
}

function createScene() {
  stars.length = 0;
  dust.length = 0;
  flowers.length = 0;

  const starCount = Math.min(500, Math.floor((W * H) / 3500));

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: random(0.4, 2.2),
      a: random(0.2, 1),
      speed: random(0.5, 2.4),
      phase: random(0, TAU)
    });
  }

  const dustCount = Math.min(900, Math.floor((W * H) / 1800));

  for (let i = 0; i < dustCount; i++) {
    const a = Math.random() * TAU;
    const radius = Math.pow(Math.random(), 0.72) * Math.min(W, H) * 0.43;

    dust.push({
      radius,
      angle: a,
      size: random(0.5, 2.7),
      speed: random(0.0007, 0.0025),
      alpha: random(0.08, 0.65),
      stretch: random(0.7, 1.5)
    });
  }

  for (let i = 0; i < 7; i++) {
    flowers.push({
      angle: (TAU / 7) * i + random(-0.2, 0.2),
      radius: Math.min(W, H) * random(0.28, 0.4),
      size: random(16, 30),
      speed: random(0.0005, 0.0012),
      phase: random(0, TAU)
    });
  }
}

function drawBackground() {
  const g = ctx.createRadialGradient(
    W * 0.5,
    H * 0.47,
    0,
    W * 0.5,
    H * 0.47,
    Math.max(W, H) * 0.75
  );

  g.addColorStop(0, "#101a46");
  g.addColorStop(0.26, "#090d28");
  g.addColorStop(0.58, "#040617");
  g.addColorStop(1, "#010106");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawNebula() {
  const cx = W * 0.5;
  const cy = H * 0.46;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 7; i++) {
    const angle = t * 0.00008 + i * 0.8;

    const x =
      cx +
      Math.cos(angle) * W * 0.13;

    const y =
      cy +
      Math.sin(angle * 1.35) * H * 0.09;

    const r =
      Math.min(W, H) *
      (0.16 + i * 0.018);

    const g = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      r
    );

    g.addColorStop(
      0,
      i % 2
        ? "rgba(255,130,190,0.10)"
        : "rgba(80,120,255,0.12)"
    );

    g.addColorStop(
      0.45,
      "rgba(50,70,255,0.045)"
    );

    g.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawStars() {
  for (const s of stars) {
    const twinkle =
      s.a *
      (0.65 +
        Math.sin(t * 0.002 * s.speed + s.phase) *
          0.35);

    ctx.globalAlpha = twinkle;
    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, TAU);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawGalaxy() {
  const cx = W * 0.5;
  const cy = H * 0.47;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "screen";

  const rotation = t * 0.00013;

  for (const p of dust) {
    const a =
      p.angle +
      rotation +
      p.radius * 0.0009;

    const armWave =
      Math.sin(p.radius * 0.035 + t * 0.001) *
      0.34;

    const x =
      Math.cos(a + armWave) *
      p.radius;

    const y =
      Math.sin(a + armWave) *
      p.radius *
      0.38;

    const shimmer =
      p.alpha *
      (0.55 +
        Math.sin(
          t * 0.002 +
          p.radius * 0.01
        ) *
          0.45);

    ctx.globalAlpha = shimmer;

    ctx.fillStyle =
      p.radius < Math.min(W, H) * 0.16
        ? "#ffe69a"
        : "#b8c7ff";

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      p.size,
      0,
      TAU
    );
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCore() {
  const cx = W * 0.5;
  const cy = H * 0.47;

  const pulse =
    1 +
    Math.sin(t * 0.0028) * 0.035;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);
  ctx.globalCompositeOperation = "screen";

  const glow = ctx.createRadialGradient(
    0,
    0,
    2,
    0,
    0,
    Math.min(W, H) * 0.24
  );

  glow.addColorStop(
    0,
    "rgba(255,238,175,0.5)"
  );

  glow.addColorStop(
    0.25,
    "rgba(255,185,50,0.18)"
  );

  glow.addColorStop(
    0.7,
    "rgba(255,110,70,0.04)"
  );

  glow.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle = glow;

  ctx.beginPath();
  ctx.arc(
    0,
    0,
    Math.min(W, H) * 0.24,
    0,
    TAU
  );
  ctx.fill();

  ctx.restore();
}

function drawRose() {
  const cx = W * 0.5;
  const cy = H * 0.47;

  const bloom =
    Math.min(1, Math.max(0, (t - 1200) / 2200));

  const pulse =
    1 + Math.sin(t * 0.003) * 0.025;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);
  ctx.globalCompositeOperation = "screen";

  const base =
    Math.min(W, H) *
    0.045 *
    (0.7 + bloom * 0.3);

  if (bloom <= 0) {
    ctx.restore();
    return;
  }

  ctx.shadowBlur = 30;
  ctx.shadowColor = "rgba(255,170,40,0.45)";

  for (let i = 0; i < 20; i++) {
    const a =
      (TAU / 20) * i +
      Math.sin(t * 0.0008) * 0.05;

    const layer = i / 20;

    const rx =
      base *
      (1.0 + layer * 1.6) *
      bloom;

    const ry =
      base *
      (1.35 + layer * 0.8) *
      bloom;

    const x =
      Math.cos(a) *
      base *
      layer *
      0.95;

    const y =
      Math.sin(a) *
      base *
      layer *
      0.7;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a + Math.PI / 2);

    const grad = ctx.createLinearGradient(
      0,
      -ry,
      0,
      ry
    );

    grad.addColorStop(0, "#fff1a6");
    grad.addColorStop(0.36, "#ffd34d");
    grad.addColorStop(1, "#f07c19");

    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -ry);

    ctx.bezierCurveTo(
      rx,
      -ry * 0.7,
      rx,
      ry * 0.6,
      0,
      ry
    );

    ctx.bezierCurveTo(
      -rx,
      ry * 0.6,
      -rx,
      -ry * 0.7,
      0,
      -ry
    );

    ctx.fill();
    ctx.restore();
  }

  ctx.shadowBlur = 0;

  const center = ctx.createRadialGradient(
    0,
    0,
    1,
    0,
    0,
    base * 1.7
  );

  center.addColorStop(0, "#fff7bf");
  center.addColorStop(0.35, "#ffc927");
  center.addColorStop(1, "#b75b08");

  ctx.fillStyle = center;

  ctx.beginPath();
  ctx.arc(
    0,
    0,
    base * 1.45,
    0,
    TAU
  );

  ctx.fill();

  ctx.restore();
}

function drawOrbitFlowers() {
  const cx = W * 0.5;
  const cy = H * 0.47;

  for (const f of flowers) {
    const a =
      f.angle +
      t * f.speed;

    const x =
      cx +
      Math.cos(a) * f.radius;

    const y =
      cy +
      Math.sin(a) * f.radius * 0.48;

    drawFlower(
      x,
      y,
      f.size,
      a + Math.PI / 2,
      f.phase
    );
  }
}

function drawFlower(x, y, size, rot, phase) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  const sway =
    1 +
    Math.sin(t * 0.002 + phase) * 0.08;

  ctx.scale(sway, sway);

  ctx.globalCompositeOperation = "screen";

  const petals = 12;

  for (let i = 0; i < petals; i++) {
    const a =
      (TAU / petals) * i;

    ctx.save();
    ctx.rotate(a);

    const grad = ctx.createRadialGradient(
      0,
      -size * 0.1,
      1,
      0,
      -size * 0.25,
      size
    );

    grad.addColorStop(0, "#fff2a1");
    grad.addColorStop(0.4, "#ffd447");
    grad.addColorStop(1, "#e69517");

    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.ellipse(
      0,
      -size * 0.42,
      size * 0.22,
      size * 0.52,
      0,
      0,
      TAU
    );

    ctx.fill();

    ctx.restore();
  }

  ctx.fillStyle = "#6b3410";

  ctx.beginPath();
  ctx.arc(
    0,
    0,
    size * 0.2,
    0,
    TAU
  );

  ctx.fill();

  ctx.restore();
}

function createPetalBurst(x, y, amount = 28) {
  for (let i = 0; i < amount; i++) {
    const a = Math.random() * TAU;
    const speed = random(1.2, 5);

    petals.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      size: random(3, 8),
      life: 1,
      rot: random(0, TAU),
      spin: random(-0.15, 0.15)
    });
  }
}

function createHeartBurst(x, y, amount = 18) {
  for (let i = 0; i < amount; i++) {
    const a = Math.random() * TAU;
    const speed = random(1, 3.5);

    hearts.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      size: random(9, 17),
      life: 1,
      rot: random(-0.3, 0.3)
    });
  }
}

function createShockwave(x, y) {
  bursts.push({
    x,
    y,
    r: 0,
    life: 1
  });
}

function updateEffects() {
  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.018;
    p.vx *= 0.99;
    p.vy *= 0.99;

    p.rot += p.spin;
    p.life -= 0.012;

    if (p.life <= 0) {
      petals.splice(i, 1);
    }
  }

  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];

    h.x += h.vx;
    h.y += h.vy;
    h.vy -= 0.012;
    h.life -= 0.009;

    if (h.life <= 0) {
      hearts.splice(i, 1);
    }
  }

  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];

    b.r += 8;
    b.life -= 0.025;

    if (b.life <= 0) {
      bursts.splice(i, 1);
    }
  }
}

function drawEffects() {
  for (const p of petals) {
    ctx.save();

    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    ctx.globalAlpha = p.life;

    ctx.fillStyle = "#ffd85c";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#ffba22";

    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      p.size,
      p.size * 0.55,
      0,
      0,
      TAU
    );

    ctx.fill();
    ctx.restore();
  }

  for (const h of hearts) {
    ctx.save();

    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);

    ctx.globalAlpha = h.life;
    ctx.fillStyle = "#ff9db2";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff4e77";

    ctx.beginPath();

    const s = h.size;

    ctx.moveTo(0, s * 0.85);

    ctx.bezierCurveTo(
      -s * 1.35,
      -s * 0.1,
      -s * 0.65,
      -s,
      0,
      -s * 0.35
    );

    ctx.bezierCurveTo(
      s * 0.65,
      -s,
      s * 1.35,
      -s * 0.1,
      0,
      s * 0.85
    );

    ctx.fill();
    ctx.restore();
  }

  for (const b of bursts) {
    ctx.save();

    ctx.globalAlpha = b.life;
    ctx.strokeStyle = "rgba(255,220,130,0.8)";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffd45c";

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }
}

function createShootingStar() {
  shootingStars.push({
    x: random(-100, W),
    y: random(0, H * 0.5),
    vx: random(7, 12),
    vy: random(3, 6),
    life: 1,
    length: random(70, 170)
  });
}

function updateShootingStars() {
  if (Math.random() < 0.008) {
    createShootingStar();
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];

    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.018;

    if (
      s.life <= 0 ||
      s.x > W + 200 ||
      s.y > H + 200
    ) {
      shootingStars.splice(i, 1);
    }
  }
}

function drawShootingStars() {
  for (const s of shootingStars) {
    ctx.save();

    const grad = ctx.createLinearGradient(
      s.x,
      s.y,
      s.x - s.length,
      s.y - s.length * 0.45
    );

    grad.addColorStop(
      0,
      `rgba(255,255,255,${s.life})`
    );

    grad.addColorStop(
      1,
      "rgba(255,220,120,0)"
    );

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - s.length,
      s.y - s.length * 0.45
    );
    ctx.stroke();

    ctx.restore();
  }
}

function animate() {
  t += 16.67;

  drawBackground();
  drawNebula();
  drawStars();
  drawGalaxy();
  drawCore();
  drawOrbitFlowers();
  drawRose();

  updateShootingStars();
  drawShootingStars();

  updateEffects();
  drawEffects();

  requestAnimationFrame(animate);
}

function startExperience(x, y) {
  if (!started) {
    started = true;
    musica.volume = 0.4;
    musica.play().catch(error => {
      console.log("No se pudo reproducir la música:", error);
    });

    intro.classList.add("hidden");
    hint.classList.add("hide");

    setTimeout(() => {
      letter.classList.add("show");
    }, 2500);

    createPetalBurst(
      W * 0.5,
      H * 0.47,
      60
    );

    createHeartBurst(
      W * 0.5,
      H * 0.47,
      35
    );

    createShockwave(
      W * 0.5,
      H * 0.47
    );

    return;
  }

  createPetalBurst(x, y, 20);
  createHeartBurst(x, y, 10);
  createShockwave(x, y);
}

function pointer(e) {
  const rect = canvas.getBoundingClientRect();

  const x =
    (e.clientX - rect.left) *
    (W / rect.width);

  const y =
    (e.clientY - rect.top) *
    (H / rect.height);

  startExperience(x, y);
}

canvas.addEventListener("pointerdown", pointer);

resize();
animate();