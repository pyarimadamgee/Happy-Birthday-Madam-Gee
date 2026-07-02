/* 🎀 Shared pookie magic: floating hearts, sparkle clicks, heart trail, music, confetti 🎀 */

const FLOATER_EMOJIS = ['💗', '💖', '🎀', '✨', '🌸', '🦋', '🩷', '⭐'];

function spawnFloaters(count = 16) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'floater';
    s.textContent = FLOATER_EMOJIS[Math.floor(Math.random() * FLOATER_EMOJIS.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 14 + Math.random() * 22 + 'px';
    s.style.animationDuration = 8 + Math.random() * 10 + 's';
    s.style.animationDelay = -(Math.random() * 12) + 's';
    document.body.appendChild(s);
  }
}

/* ✨ sparkles wherever she taps */
document.addEventListener('click', (e) => {
  const sparks = ['✨', '💖', '🌟', '💫'];
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('span');
    s.className = 'click-spark';
    s.textContent = sparks[i % sparks.length];
    s.style.left = e.pageX + 'px';
    s.style.top = e.pageY + 'px';
    s.style.setProperty('--dx', (Math.random() * 140 - 70) + 'px');
    s.style.setProperty('--dy', (Math.random() * -140 - 30) + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
});

/* 💗 heart trail following her finger / cursor */
let lastTrail = 0;
function trailAt(x, y) {
  const now = Date.now();
  if (now - lastTrail < 90) return;
  lastTrail = now;
  const h = document.createElement('span');
  h.className = 'trail-heart';
  h.textContent = ['🩷', '💗', '✨'][Math.floor(Math.random() * 3)];
  h.style.left = x + 'px';
  h.style.top = y + 'px';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1000);
}
document.addEventListener('mousemove', e => trailAt(e.pageX, e.pageY));
document.addEventListener('touchmove', e => {
  const t = e.touches[0];
  if (t) trailAt(t.pageX, t.pageY);
}, { passive: true });

/* 🎵 music + mute */
function setupMusic() {
  const audio = document.getElementById('bgMusic');
  if (!audio) return;
  audio.volume = 0.7;
  audio.play().catch(() => {
    const playOnce = () => { audio.play(); document.removeEventListener('click', playOnce); };
    document.addEventListener('click', playOnce);
  });
  const btn = document.getElementById('muteBtn');
  if (btn) btn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    btn.textContent = audio.muted ? '🔇' : '🔊';
  });
}

/* 🎊 confetti */
let confettiPieces = [];
let confettiCtx = null;

function initConfetti() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
  }
  confettiCtx = canvas.getContext('2d');
  const size = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  size();
  addEventListener('resize', size);
  let needsClear = false;
  (function loop() {
    if (confettiPieces.length === 0) {
      /* idle: nothing to animate — skip all work */
      if (needsClear) { confettiCtx.clearRect(0, 0, canvas.width, canvas.height); needsClear = false; }
      requestAnimationFrame(loop);
      return;
    }
    needsClear = true;
    confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      if (p.heart) {
        confettiCtx.font = p.w + 'px serif';
        confettiCtx.fillText('💗', -p.w / 2, p.w / 2);
      } else {
        confettiCtx.fillStyle = p.c;
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      confettiCtx.restore();
    });
    confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 40);
    requestAnimationFrame(loop);
  })();
}

function confettiBurst(n = 180) {
  if (!confettiCtx) initConfetti();
  const colors = ['#ff6fa5', '#ffd166', '#b892ff', '#7bd3ea', '#ff9a3d', '#ffb3c6'];
  for (let i = 0; i < n; i++) {
    confettiPieces.push({
      x: Math.random() * innerWidth,
      y: -20 - Math.random() * innerHeight * 0.35,
      w: 6 + Math.random() * 9, h: 8 + Math.random() * 11,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3.5, vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI, vr: -0.1 + Math.random() * 0.2,
      heart: Math.random() < 0.18
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  spawnFloaters();
  setupMusic();
  initConfetti();
});
