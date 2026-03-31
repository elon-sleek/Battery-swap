/* ================================================================
   VOLTKEKE — SCRIPT.JS
   Handles: preloader, navbar scroll, reveal animations,
            counters, floating objects, form submission
   ================================================================ */

'use strict';

/* ── PRELOADER ──────────────────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloader-fill');
  if (!preloader || !fill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => preloader.classList.add('hidden'), 300);
    }
    fill.style.width = progress + '%';
  }, 100);
})();

/* ── NAVBAR SCROLL BEHAVIOUR ────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER MENU ─────────────────────────────────────────── */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

/* ── SMOOTH ANCHOR SCROLLING ─────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── INTERSECTION OBSERVER — REVEAL ON SCROLL ────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — keep visible once triggered
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ── ANIMATED COUNTERS ───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter, .stat-num[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 2000;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ── PROBLEM BAR ANIMATION ───────────────────────────────────── */
(function initProblemBars() {
  const bars = document.querySelectorAll('.problem-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ── CHART BAR ANIMATION ─────────────────────────────────────── */
(function initChartBars() {
  const bars = document.querySelectorAll('.chart-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ── HERO PARALLAX ───────────────────────────────────────────── */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const gridOverlay = hero.querySelector('.grid-overlay');
  const floatObjs = hero.querySelectorAll('.orbit-ring');

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (gridOverlay) {
      gridOverlay.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    floatObjs.forEach((el, i) => {
      const factor = (i + 1) * 0.08;
      el.style.transform = `translate(-50%, calc(-50% + ${scrollY * factor}px)) rotate(${scrollY * 0.02}deg)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── CURSOR GLOW EFFECT ──────────────────────────────────────── */
(function initCursorGlow() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9998',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s',
    top: '0',
    left: '0',
  });
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let rafId = null;
  let moving = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!moving) {
      moving = true;
      rafId = requestAnimationFrame(raf);
    }
  });

  const raf = () => {
    const dx = mouseX - glowX;
    const dy = mouseY - glowY;
    glowX += dx * 0.08;
    glowY += dy * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';

    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      rafId = requestAnimationFrame(raf);
    } else {
      moving = false;
      rafId = null;
    }
  };
})();

/* ── FORM SUBMISSION ─────────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('cta-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const route = form.querySelector('[name="route"]').value;
    const kekes = parseInt(form.querySelector('[name="kekes"]').value, 10);

    // Validate name
    const nameOk = name.length >= 2;
    // Validate phone: digits, spaces, +, -, () — at least 7 digits total
    const phoneDigits = phone.replace(/\D/g, '');
    const phoneOk = /^[0-9\s\+\-\(\)]+$/.test(phone) && phoneDigits.length >= 7;
    // Validate route selection
    const routeOk = route !== '';
    // Validate kekes count (optional but if filled must be >= 1)
    const kekesOk = isNaN(kekes) || kekes >= 1;

    const invalid = [];
    if (!nameOk) invalid.push('[name="name"]');
    if (!phoneOk) invalid.push('[name="phone"]');
    if (!routeOk) invalid.push('[name="route"]');
    if (!kekesOk) invalid.push('[name="kekes"]');

    if (invalid.length > 0) {
      invalid.forEach(sel => {
        const el = form.querySelector(sel);
        if (!el) return;
        el.style.borderColor = 'rgba(255,255,255,0.6)';
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          el.style.animation = '';
          el.style.borderColor = '';
        }, 600);
      });
      return;
    }

    // Show success
    form.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(() => {
      form.classList.add('hidden');
      success.classList.remove('hidden');
      success.style.animation = 'fadeIn 0.6s ease forwards';
    }, 400);
  });
})();

/* ── TYPED TEXT EFFECT FOR HERO BADGE ───────────────────────── */
(function initTypedEffect() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  const texts = [
    'ABIA STATE · EV REVOLUTION',
    'CLEAN ENERGY · ZERO EMISSIONS',
    'INSTANT SWAP · ALWAYS MOVING',
  ];
  let idx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  const type = () => {
    if (paused) return;
    const current = texts[idx];

    if (deleting) {
      charIdx--;
      badge.textContent = current.substring(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % texts.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 40);
    } else {
      charIdx++;
      badge.textContent = current.substring(0, charIdx);
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => {
          paused = false;
          deleting = true;
          type();
        }, 2500);
        return;
      }
      setTimeout(type, 70);
    }
  };

  // Start after preloader
  setTimeout(type, 1500);
})();

/* ── DYNAMIC PARTICLE SPAWNER ────────────────────────────────── */
(function initDynamicParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const spawnParticle = () => {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 6 + 5;

    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      background: 'rgba(255,255,255,' + (Math.random() * 0.3 + 0.1) + ')',
      borderRadius: '50%',
      left: left + '%',
      bottom: '0',
      pointerEvents: 'none',
      animation: `particle-rise ${duration}s linear forwards`,
    });

    hero.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000);
  };

  // Spawn a particle every 800ms
  setInterval(spawnParticle, 800);
})();

/* ── SECTION PROGRESS INDICATOR ─────────────────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '2px',
    background: 'rgba(255,255,255,0.8)',
    zIndex: '10001',
    width: '0%',
    transition: 'width 0.1s linear',
    boxShadow: '0 0 8px rgba(255,255,255,0.4)',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
})();

/* ── KEYFRAME INJECTION ───────────────────────────────────────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      to { opacity: 0; transform: translateY(-10px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: none; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
})();
