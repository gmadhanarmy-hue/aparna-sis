/* ==========================================================================
   APARNA BIRTHDAY SURPRISE — DARK CINEMATIC JAVASCRIPT ENGINE
   ========================================================================== */

// ==========================================================================
// 🔗 1. MICROSOFT FORMS URL (PASTE YOUR FORM LINK HERE)
// ==========================================================================
// Simply replace the URL below with your actual Microsoft Forms link:
const MICROSOFT_FORM_URL = "https://forms.cloud.microsoft/r/NqcNHEqjyC?origin=lprLink";
// ==========================================================================

// Global state
const state = {
  currentPage: 1,
  totalPages: 6,
  favColor: '#f06292',
  cakeCut: false,
  currentCardIndex: 0
};

// Recognized colour database with luxury dark-accent compatible shades
const COLOR_MAP = {
  pink: { hex: '#f06292', light: '#fce4ec', rgb: '240, 98, 146' },
  rose: { hex: '#e91e63', light: '#f8bbd0', rgb: '233, 30, 99' },
  'rose gold': { hex: '#d48894', light: '#faeef0', rgb: '212, 136, 148' },
  purple: { hex: '#a855f7', light: '#f3e8ff', rgb: '168, 85, 247' },
  lavender: { hex: '#a78bfa', light: '#ede9fe', rgb: '167, 139, 250' },
  lilac: { hex: '#c084fc', light: '#f5f3ff', rgb: '192, 132, 252' },
  blue: { hex: '#38bdf8', light: '#e0f2fe', rgb: '56, 189, 248' },
  'sky blue': { hex: '#60a5fa', light: '#eff6ff', rgb: '96, 165, 250' },
  navy: { hex: '#3b82f6', light: '#dbeafe', rgb: '59, 130, 246' },
  red: { hex: '#f43f5e', light: '#ffe4e6', rgb: '244, 63, 94' },
  ruby: { hex: '#e11d48', light: '#ffe4e6', rgb: '225, 29, 72' },
  green: { hex: '#22c55e', light: '#dcfce7', rgb: '34, 197, 94' },
  mint: { hex: '#2dd4bf', light: '#ccfbf1', rgb: '45, 212, 191' },
  yellow: { hex: '#facc15', light: '#fef9c3', rgb: '250, 204, 21' },
  gold: { hex: '#e5c158', light: '#fef3c7', rgb: '229, 193, 88' },
  'champagne gold': { hex: '#e5c158', light: '#fef3c7', rgb: '229, 193, 88' },
  orange: { hex: '#fb923c', light: '#ffedd5', rgb: '251, 146, 60' },
  peach: { hex: '#fba07a', light: '#fff1eb', rgb: '251, 160, 122' },
  coral: { hex: '#fb7185', light: '#ffe4e6', rgb: '251, 113, 133' },
  white: { hex: '#ffffff', light: '#ffffff', rgb: '255, 255, 255' },
  black: { hex: '#94a3b8', light: '#f1f5f9', rgb: '148, 163, 184' },
  violet: { hex: '#8b5cf6', light: '#ede9fe', rgb: '139, 92, 246' },
  maroon: { hex: '#be123c', light: '#ffe4e6', rgb: '190, 18, 60' },
  cyan: { hex: '#06b6d4', light: '#cffafe', rgb: '6, 182, 212' },
  teal: { hex: '#14b8a6', light: '#ccfbf1', rgb: '20, 184, 166' },
  magenta: { hex: '#ec4899', light: '#fce7f3', rgb: '236, 72, 153' }
};

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initColorChips();
  initColorSelection();
  initCakeCutting();
  initPolaroidAlbum();
  initMusicPlayer();
  initFinalTouch();
  initScrollAnimations();
});

/* ==========================================================================
   PAGE TRANSITION CONTROLLER & AUDIO ORCHESTRATION
   ========================================================================== */

function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > state.totalPages) return;

  const currentPageEl = document.getElementById(`page-${state.currentPage}`);
  const targetPageEl = document.getElementById(`page-${pageNumber}`);

  if (currentPageEl) {
    currentPageEl.classList.remove('active');
  }

  // Smooth scroll back to top of container
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    if (targetPageEl) {
      targetPageEl.classList.add('active');
    }
    state.currentPage = pageNumber;
    updateIndicators(pageNumber);

    // Trigger scroll animation check on new page
    initScrollAnimations();

    // CHANGE 5: When Page 6 opens, automatically start the background song
    if (pageNumber === 6) {
      handlePage6AutoPlay();
    }
  }, 250);
}

function updateIndicators(pageNumber) {
  const dots = document.querySelectorAll('.step-dot');
  dots.forEach((dot, idx) => {
    if (idx + 1 === pageNumber) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Automatic audio playback on Page 6 with browser autoplay policy fallback
function handlePage6AutoPlay() {
  if (window.birthdayAudio && !window.birthdayAudio.isBgmPlaying) {
    window.birthdayAudio.startBgm();

    // Fallback: If browser autoplay policy blocked audio without gesture, start on next interaction
    const tryResumeOnTouch = () => {
      if (window.birthdayAudio && !window.birthdayAudio.isBgmPlaying) {
        window.birthdayAudio.startBgm();
      }
      window.removeEventListener('touchstart', tryResumeOnTouch);
      window.removeEventListener('click', tryResumeOnTouch);
      window.removeEventListener('scroll', tryResumeOnTouch);
    };

    window.addEventListener('touchstart', tryResumeOnTouch, { once: true });
    window.addEventListener('click', tryResumeOnTouch, { once: true });
    window.addEventListener('scroll', tryResumeOnTouch, { once: true });
  }
}

/* ==========================================================================
   PAGE 1: FAVOURITE COLOUR & DYNAMIC BALLOONS REVEAL
   ========================================================================== */

function initColorChips() {
  const chips = document.querySelectorAll('.color-chip');
  const input = document.getElementById('fav-color-input');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const val = chip.getAttribute('data-color');
      if (input) {
        input.value = val;
      }
    });
  });
}

function parseEnteredColor(inputStr) {
  if (!inputStr) return COLOR_MAP.pink;
  const clean = inputStr.trim().toLowerCase();

  // Exact or partial match in COLOR_MAP
  if (COLOR_MAP[clean]) {
    return COLOR_MAP[clean];
  }
  for (const key in COLOR_MAP) {
    if (clean.includes(key)) {
      return COLOR_MAP[key];
    }
  }

  // Hex color check
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) {
    return { hex: clean, light: '#faedf3', rgb: '235, 120, 165' };
  }

  // Fallback gentle rose
  return COLOR_MAP.pink;
}

function applyFavColor(colorObj) {
  state.favColor = colorObj.hex;
  const root = document.documentElement;
  root.style.setProperty('--fav-color', colorObj.hex);
  root.style.setProperty('--fav-color-light', colorObj.light);
  root.style.setProperty('--fav-color-glow', `rgba(${colorObj.rgb}, 0.45)`);
  root.style.setProperty('--fav-color-rgb', colorObj.rgb);
}

function initColorSelection() {
  const btnContinue = document.getElementById('btn-color-continue');
  const input = document.getElementById('fav-color-input');
  const revealWrap = document.getElementById('birthday-reveal-wrap');
  const colorPickerBox = document.getElementById('color-picker-box');

  if (!btnContinue || !input) return;

  btnContinue.addEventListener('click', () => {
    const rawVal = input.value;
    const resolvedColor = parseEnteredColor(rawVal);
    applyFavColor(resolvedColor);

    // Launch celebratory dynamic balloons
    spawnBalloons(resolvedColor.hex, 20);

    // Confetti burst
    fireConfetti();

    // Cinematic message reveal
    if (colorPickerBox) {
      colorPickerBox.style.opacity = '0.4';
      colorPickerBox.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      if (revealWrap) {
        revealWrap.classList.add('revealed');
        revealWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 600);
  });

  // Allow enter key press
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnContinue.click();
    }
  });

  // Page 1 "Cake Cutting 🎂" Button
  const btnGoToCake = document.getElementById('btn-to-cake');
  if (btnGoToCake) {
    btnGoToCake.addEventListener('click', () => {
      goToPage(2);
    });
  }
}

function spawnBalloons(colorHex, count = 18) {
  const container = document.getElementById('balloon-container');
  if (!container) return;

  const isWhite = colorHex.toLowerCase() === '#ffffff' || colorHex.toLowerCase() === '#f8fafc';

  for (let i = 0; i < count; i++) {
    const delay = i * 260;
    setTimeout(() => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      
      const leftPercent = 5 + Math.random() * 85;
      const sizeScale = 0.75 + Math.random() * 0.55;
      const duration = 6.5 + Math.random() * 3.5;
      
      balloon.style.left = `${leftPercent}%`;
      balloon.style.transform = `scale(${sizeScale})`;
      balloon.style.animationDuration = `${duration}s`;

      if (isWhite) {
        balloon.style.background = `radial-gradient(circle at 35% 30%, #ffffff 0%, #f4f7fb 42%, #d8e2ec 78%, rgba(160, 175, 195, 0.6) 100%)`;
        balloon.style.boxShadow = `inset -3px -3px 8px rgba(0,0,0,0.2), 0 8px 25px rgba(255,255,255,0.4), 0 0 15px rgba(229,193,88,0.25)`;
      } else {
        balloon.style.background = `radial-gradient(circle at 35% 30%, #ffffff 0%, ${colorHex} 52%, rgba(0,0,0,0.5) 100%)`;
      }

      const string = document.createElement('div');
      string.className = 'balloon-string';
      balloon.appendChild(string);

      container.appendChild(balloon);

      // Clean up DOM after float completion
      setTimeout(() => {
        balloon.remove();
      }, (duration + 1) * 1000);
    }, delay);
  }
}

/* ==========================================================================
   DIWALI AERIAL FIREWORKS CANVAS ENGINE (LUXURY NIGHT SKY CELEBRATION)
   ========================================================================== */

let fireworksActive = false;
let fireworksAnimId = null;
let fireworksTimer = null;
let fireworksCanvas = null;
let fireworksCtx = null;
let rockets = [];
let fireworkParticles = [];

const FIREWORK_PALETTE = [
  { r: 229, g: 193, b: 88, name: 'champagne-gold' },
  { r: 255, g: 215, b: 65, name: 'bright-gold' },
  { r: 250, g: 229, b: 167, name: 'gold-light' },
  { r: 244, g: 114, b: 182, name: 'soft-rose' },
  { r: 251, g: 146, b: 60, name: 'warm-amber' },
  { r: 192, g: 132, b: 252, name: 'lavender-violet' },
  { r: 255, g: 255, b: 255, name: 'starlight-white' }
];

function initFireworksCanvas() {
  fireworksCanvas = document.getElementById('fireworks-canvas');
  if (!fireworksCanvas) return;
  fireworksCtx = fireworksCanvas.getContext('2d');
  resizeFireworksCanvas();
  window.addEventListener('resize', resizeFireworksCanvas);
}

function resizeFireworksCanvas() {
  if (!fireworksCanvas) return;
  const rect = fireworksCanvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fireworksCanvas.width = (rect.width || 440) * dpr;
  fireworksCanvas.height = (rect.height || 420) * dpr;
  if (fireworksCtx) {
    fireworksCtx.scale(dpr, dpr);
  }
}

class AerialRocket {
  constructor(w, h, targetX, targetY, color) {
    this.x = targetX !== undefined ? targetX : w * (0.15 + Math.random() * 0.7);
    this.y = h;
    this.targetY = targetY !== undefined ? targetY : h * (0.12 + Math.random() * 0.38);
    this.color = color || FIREWORK_PALETTE[Math.floor(Math.random() * FIREWORK_PALETTE.length)];
    this.speed = 7 + Math.random() * 3.5;
    this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.25;
    this.vx = Math.cos(this.angle) * this.speed * 0.35;
    this.vy = Math.sin(this.angle) * this.speed;
    this.trail = [];
    this.exploded = false;
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: 1 });
    if (this.trail.length > 8) this.trail.shift();
    this.trail.forEach(t => t.alpha *= 0.82);

    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;

    if (this.vy >= -1.5 || this.y <= this.targetY) {
      this.exploded = true;
      explodeAerialRocket(this.x, this.y, this.color);
    }
  }

  draw(ctx) {
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, (i / this.trail.length) * 2.2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${p.alpha * 0.8})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
    ctx.fill();
    ctx.restore();
  }
}

class SparkleParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4.8 + 1.2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.018 + 0.012;
    this.friction = 0.955;
    this.gravity = 0.07;
    this.size = Math.random() * 2.4 + 1.2;
    this.flicker = Math.random() > 0.35;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    const currentAlpha = this.flicker ? (Math.random() > 0.2 ? this.alpha : this.alpha * 0.4) : this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 0.8})`;
    ctx.fill();
    ctx.restore();
  }
}

function explodeAerialRocket(x, y, color) {
  const particleCount = 45 + Math.floor(Math.random() * 25);
  for (let i = 0; i < particleCount; i++) {
    const pColor = Math.random() > 0.25 ? color : (Math.random() > 0.5 ? FIREWORK_PALETTE[0] : FIREWORK_PALETTE[6]);
    fireworkParticles.push(new SparkleParticle(x, y, pColor));
  }
}

function startFireworksCanvas() {
  if (!fireworksCanvas) {
    initFireworksCanvas();
  }
  if (!fireworksCanvas) return;

  fireworksActive = true;
  fireworksCanvas.classList.add('active');
  resizeFireworksCanvas();

  const rect = fireworksCanvas.getBoundingClientRect();
  const w = rect.width || 440;
  const h = rect.height || 420;

  // Immediate 3-rocket salvo on Click 1 (left, right, center)
  rockets.push(new AerialRocket(w, h, w * 0.22, h * 0.25, FIREWORK_PALETTE[0]));
  setTimeout(() => {
    if (fireworksActive) rockets.push(new AerialRocket(w, h, w * 0.78, h * 0.28, FIREWORK_PALETTE[3]));
  }, 180);
  setTimeout(() => {
    if (fireworksActive) rockets.push(new AerialRocket(w, h, w * 0.50, h * 0.18, FIREWORK_PALETTE[1]));
  }, 380);

  // Continuous rhythmic rocket launches while cake cutting is underway
  function scheduleNextRocket() {
    if (!fireworksActive) return;
    const delay = Math.random() * 450 + 550;
    fireworksTimer = setTimeout(() => {
      if (!fireworksActive) return;
      const rectNow = fireworksCanvas.getBoundingClientRect();
      const currentW = rectNow.width || 440;
      const currentH = rectNow.height || 420;
      const targetX = Math.random() > 0.5 
        ? currentW * (0.12 + Math.random() * 0.28) 
        : currentW * (0.60 + Math.random() * 0.28);
      rockets.push(new AerialRocket(currentW, currentH, targetX));
      scheduleNextRocket();
    }, delay);
  }
  scheduleNextRocket();

  if (!fireworksAnimId) {
    runFireworksLoop();
  }
}

function stopFireworksCanvas() {
  fireworksActive = false;
  if (fireworksTimer) {
    clearTimeout(fireworksTimer);
    fireworksTimer = null;
  }
  setTimeout(() => {
    if (fireworksCanvas) {
      fireworksCanvas.classList.remove('active');
    }
    rockets = [];
    fireworkParticles = [];
  }, 1400);
}

function runFireworksLoop() {
  if (!fireworksCtx || !fireworksCanvas) return;
  const rect = fireworksCanvas.getBoundingClientRect();
  const w = rect.width || 440;
  const h = rect.height || 420;

  fireworksCtx.clearRect(0, 0, w, h);

  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.update();
    r.draw(fireworksCtx);
    if (r.exploded) {
      rockets.splice(i, 1);
    }
  }

  for (let i = fireworkParticles.length - 1; i >= 0; i--) {
    const p = fireworkParticles[i];
    p.update();
    p.draw(fireworksCtx);
    if (p.alpha <= 0) {
      fireworkParticles.splice(i, 1);
    }
  }

  if (fireworksActive || rockets.length > 0 || fireworkParticles.length > 0) {
    fireworksAnimId = requestAnimationFrame(runFireworksLoop);
  } else {
    fireworksAnimId = null;
    fireworksCtx.clearRect(0, 0, w, h);
  }
}

/* ==========================================================================
   PAGE 2: COMPLETE THREE-CLICK CAKE CUTTING SEQUENCE
   ========================================================================== */

function initCakeCutting() {
  initFireworksCanvas();

  const flame = document.getElementById('candle-flame');
  const smoke = document.getElementById('smoke-puff');
  const knife = document.getElementById('cake-knife');
  const cakeBody = document.getElementById('cake-body');
  const cakeSlice = document.getElementById('cake-slice');
  const akkowwMsg = document.getElementById('akkoww-reveal');

  const btnStep1 = document.getElementById('btn-cake-step-1');
  const btnStep2 = document.getElementById('btn-cake-step-2');
  const btnStep3 = document.getElementById('btn-cake-step-3');
  const btnNext = document.getElementById('btn-cake-next');

  let cakeStep = 1;

  // CLICK 1: CANDLE OFF + DIWALI AERIAL FIREWORKS + CAKE-BGM STARTS + "Happiest birthday akkoww😍"
  if (btnStep1) {
    btnStep1.addEventListener('click', () => {
      if (cakeStep !== 1) return;
      cakeStep = 2;

      // 1. Extinguish candle flame with smooth animation
      if (flame) flame.classList.add('extinguished');
      if (smoke) smoke.classList.add('rise');

      // 2. Immediately trigger Diwali aerial fireworks in the sky
      startFireworksCanvas();

      // 3. Play cracker/firework audio
      if (window.birthdayAudio) {
        window.birthdayAudio.playFireworks();
      }

      // 4. Start cake-cutting background music (assets/audio/cake-bgm.mp3)
      if (window.birthdayAudio) {
        window.birthdayAudio.startCakeBgm();
      }

      // 5. Immediately show background text: "Happiest birthday akkoww😍"
      if (akkowwMsg) {
        akkowwMsg.classList.add('visible');
      }

      // 6. Hide Step 1 button, reveal Step 2 button ("Cut the Cake 🔪")
      // Cake is NOT cut yet. Knife does NOT move yet. Next button is NOT shown.
      btnStep1.style.display = 'none';
      if (btnStep2) {
        btnStep2.style.display = 'inline-flex';
        btnStep2.classList.add('fade-in-up');
      }
    });
  }

  // CLICK 2: KNIFE CUTS ONE PIECE ONLY (SEPARATES OUTWARD, STAYS NEAR CAKE)
  if (btnStep2) {
    btnStep2.addEventListener('click', () => {
      if (cakeStep !== 2) return;
      cakeStep = 3;

      btnStep2.style.display = 'none';

      // 1. Knife moves smoothly to cake and cuts
      if (knife) {
        knife.classList.add('cutting');
      }

      // 2. Cuts ONE piece: slice visibly separates outward (~28px) with notch visible
      setTimeout(() => {
        if (cakeBody) {
          cakeBody.classList.add('cake-cut-active');
        }
        if (cakeSlice) {
          cakeSlice.classList.add('separated');
        }
      }, 750);

      // 3. Reveal Step 3 button ("Place the Cake 🍰")
      // Piece does NOT move to plate yet. Next button is NOT shown.
      setTimeout(() => {
        if (btnStep3) {
          btnStep3.style.display = 'inline-flex';
          btnStep3.classList.add('fade-in-up');
        }
      }, 1400);
    });
  }

  // CLICK 3: PLACE PIECE ON PLATE + STOP CAKE BGM & FIREWORKS + CONFETTI + REVEAL NEXT
  if (btnStep3) {
    btnStep3.addEventListener('click', () => {
      if (cakeStep !== 3) return;
      cakeStep = 4;

      btnStep3.style.display = 'none';

      // 1. Cut piece moves smoothly onto dessert plate and stays there
      if (cakeSlice) {
        cakeSlice.classList.remove('separated');
        cakeSlice.classList.add('on-plate');
      }

      // 2. Immediately stop cake-cutting music
      if (window.birthdayAudio) {
        window.birthdayAudio.stopCakeBgm();
      }

      // 3. Stop cracker/firework effect & audio
      stopFireworksCanvas();
      if (window.birthdayAudio) {
        window.birthdayAudio.stopFireworks();
      }

      // 4. Celebration confetti burst
      fireConfetti();

      // 5. ONLY NOW reveal the final Next button ("Next ✨")
      setTimeout(() => {
        if (btnNext) {
          btnNext.style.display = 'inline-flex';
          btnNext.classList.add('fade-in-up');
          btnNext.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 1500);
    });
  }

  // Proceed to Page 3 (do NOT restart cake music)
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      goToPage(3);
    });
  }
}

/* ==========================================================================
   PAGE 3, 4, 5 NAVIGATION DELEGATION
   ========================================================================= */

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'btn-to-page-4') {
    goToPage(4);
  }
  if (e.target && e.target.id === 'btn-aval') {
    goToPage(5);
  }
  if (e.target && e.target.id === 'btn-to-page-6') {
    goToPage(6);
  }
});

/* ==========================================================================
   PAGE 4: POLAROID MEMORY ALBUM INTERACTION
   ========================================================================== */

function initPolaroidAlbum() {
  const cards = document.querySelectorAll('.polaroid-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      // Swipe animation to cycle through memory cards
      card.classList.add('swiped');
      setTimeout(() => {
        card.classList.remove('swiped');
        // Rearrange z-indices
        cards.forEach((c) => {
          let currentZ = parseInt(c.style.zIndex || window.getComputedStyle(c).zIndex) || 1;
          currentZ = currentZ <= 1 ? cards.length : currentZ - 1;
          c.style.zIndex = currentZ;
        });
      }, 500);
    });
  });
}

/* ==========================================================================
   PAGE 6: TAMIL BGM MUSIC PLAYER CONTROLLER
   ========================================================================== */

function initMusicPlayer() {
  const playBtn = document.getElementById('btn-play-pause');
  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    if (window.birthdayAudio) {
      window.birthdayAudio.toggleBgm();
    }
  });
}

/* ==========================================================================
   FINAL SECTION: FINAL TOUCH (MICROSOFT FORMS REDIRECT)
   ========================================================================== */

function initFinalTouch() {
  const btnFinal = document.getElementById('btn-final-touch');
  if (!btnFinal) return;

  btnFinal.addEventListener('click', () => {
    // 1. Immediately stop/pause ALL website background music BEFORE opening Microsoft Form
    if (window.birthdayAudio) {
      window.birthdayAudio.stopAllAudio();
    }
    document.querySelectorAll('audio').forEach(a => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });

    // Confetti burst
    fireConfetti();

    // Visual feedback
    btnFinal.textContent = 'Opening Form... ✨';
    setTimeout(() => {
      // Open Microsoft Forms cleanly in new tab
      window.open(MICROSOFT_FORM_URL, '_blank', 'noopener,noreferrer');
      btnFinal.textContent = 'Final Touch ✨';
    }, 650);
  });
}

/* ==========================================================================
   AMBIENT LUMINOUS STARDUST PARTICLES ENGINE (DARK OPTIMIZED)
   ========================================================================== */

function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(Math.floor(width / 15), 55);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.15),
      speedX: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.75 + 0.2,
      fadeSpeed: Math.random() * 0.008 + 0.003,
      isPurple: Math.random() > 0.65
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += p.fadeSpeed;

      if (p.alpha > 0.85 || p.alpha < 0.15) {
        p.fadeSpeed = -p.fadeSpeed;
      }

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      if (p.isPurple) {
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
      } else {
        ctx.fillStyle = `rgba(229, 193, 88, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(229, 193, 88, 0.5)';
      }

      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

function fireConfetti() {
  const count = 50;
  const colors = [
    '#e5c158', '#fae5a7', state.favColor, '#ffffff', '#c084fc', '#a855f7'
  ];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.width = `${Math.random() * 9 + 6}px`;
    el.style.height = `${Math.random() * 14 + 8}px`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '999';
    el.style.boxShadow = '0 0 12px rgba(229, 193, 88, 0.45)';

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 240 + 90;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity + 150;
    const rotation = Math.random() * 720;

    document.body.appendChild(el);

    const animation = el.animate([
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0.6) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 800 + 950,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    });

    animation.onfinish = () => el.remove();
  }
}

/* ==========================================================================
   SCROLL REVEAL UTILITY (SMOOTH CARD REVEALS)
   ========================================================================== */

function initScrollAnimations() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(r => observer.observe(r));
}
