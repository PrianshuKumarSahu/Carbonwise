/**
 * @module home
 * @description Home/Landing page with hero section, animated particles, and feature cards.
 *
 * Features:
 * - **Floating Particles Canvas**: WebGL-like particle system with connection lines.
 * - **IntersectionObserver**: Pauses particle animation when off-screen (battery optimization).
 * - **Counter Animations**: Smooth easeOutQuart number counters for statistics.
 * - **3D Tilt Cards**: Interactive hover effect on "How It Works" cards.
 *
 * @requires ../router.js - Hash-based navigation for CTA buttons.
 * @requires ../utils/icon-helper.js - Inline SVG icon rendering.
 */

import { navigate } from '../router.js';
import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';

/**
 * Configuration for the "How It Works" step cards.
 * @type {Array<{icon: string, title: string, desc: string, gradient: string}>}
 */
const HOW_IT_WORKS_STEPS = [
  {
    icon: 'Calculator',
    title: '1. Calculate',
    desc: 'Answer simple questions about your transport, energy, diet, and shopping habits.',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,78,59,0.5))',
  },
  {
    icon: 'BarChart2',
    title: '2. Track',
    desc: 'View your personalized dashboard and see how you compare to global averages.',
    gradient: 'linear-gradient(135deg, rgba(8,145,178,0.2), rgba(6,78,59,0.5))',
  },
  {
    icon: 'TrendingDown',
    title: '3. Reduce',
    desc: 'Get actionable, tailored tips to lower your footprint and track your progress.',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(6,78,59,0.5))',
  },
];

/**
 * Configuration for the "Why It Matters" stat cards.
 * @type {Array<{value: number, suffix: string, label: string, icon: string, color: string}>}
 */
const STAT_CARDS = [
  { value: 4.7, suffix: 't', label: 'World Average CO₂ per person', icon: 'Globe', color: '#10B981' },
  { value: 15.2, suffix: 't', label: 'US Average CO₂ per person', icon: 'Flag', color: '#F59E0B' },
  { value: 73, suffix: '%', label: 'Of global emissions from energy', icon: 'Zap', color: '#0891B2' },
  { value: 40, suffix: '', label: 'Trees needed to offset 1 tonne', icon: 'TreePine', color: '#34D399' },
];

/** @type {number} Number of floating particles to render. */
const PARTICLE_COUNT = 50;

/** @type {number} Maximum distance (px) for drawing connection lines between particles. */
const CONNECTION_DISTANCE = 120;

/**
 * Animates a number counter with easeOutQuart easing.
 * @param {HTMLElement} el - The DOM element whose textContent will be updated.
 * @param {number} target - The target number to animate towards.
 * @param {string} suffix - Suffix to append (e.g., 't', '%').
 * @param {number} [duration=2000] - Animation duration in milliseconds.
 */
function animateCounter(el, target, suffix, duration = 2000) {
  let start = null;
  const isFloat = target % 1 !== 0;

  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const val = eased * target;
    el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/**
 * Initializes the floating particle animation system on a canvas element.
 * @param {HTMLCanvasElement} canvas - The target canvas.
 * @returns {{ cleanup: Function }} Object with cleanup function to stop animation.
 */
function initParticleSystem(canvas) {
  let animId;
  let isVisible = true;
  const ctx = canvas.getContext('2d');

  /** Resizes the canvas to match the window dimensions. */
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Generate particles
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.3 - 0.2,
    opacity: Math.random() * 0.5 + 0.1,
    hue: Math.random() > 0.7 ? 45 : 160,
  }));

  /** Main render loop for particle animation. */
  function draw() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity * 0.15})`;
      ctx.fill();
    });

    // Draw connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(52, 211, 153, ${0.08 * (1 - dist / CONNECTION_DISTANCE)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Pause animation when canvas is off-screen
  const particleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible) draw();
    });
  }, { threshold: 0 });

  particleObserver.observe(canvas);

  return {
    cleanup: () => {
      cancelAnimationFrame(animId);
      particleObserver.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    },
  };
}

/**
 * Attaches a 3D tilt hover effect to a set of card elements.
 * @param {NodeListOf<HTMLElement>} cards - The card elements to enhance.
 */
function attachTiltEffect(cards) {
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/**
 * Renders the Home page into the provided container.
 * @param {HTMLElement} container - The parent DOM element to render into.
 * @returns {Function} Cleanup function that stops animations and disconnects observers.
 */
export default function render(container) {
  const page = document.createElement('div');
  page.className = 'page-home';

  // ─── Floating Particles Canvas ─────────────────────────────────
  const particlesCanvas = document.createElement('canvas');
  particlesCanvas.id = 'particles-canvas';
  particlesCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0.6;';
  page.appendChild(particlesCanvas);

  // ─── Hero Section ──────────────────────────────────────────────
  const hero = document.createElement('section');
  hero.className = 'hero reveal';
  hero.innerHTML = `
    <div class="hero-glow"></div>
    <h1 style="font-family: 'Space Grotesk', sans-serif; font-weight: 800; color: #022c22; letter-spacing: -1px;">Understand, Track & Reduce Your <br/><span style="background: linear-gradient(135deg, #059669 0%, #0ea5e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: none;">Carbon Footprint</span></h1>
    <p>Join the movement. Discover your environmental impact through personalized insights, and take action with science-backed reduction strategies.</p>
    <button class="btn btn-primary btn-hero-cta" style="font-size:1.25rem; padding:var(--space-4) var(--space-8); position:relative; overflow:hidden;">
      <span class="btn-shimmer"></span>
      Calculate Your Footprint ${iconSVG('ArrowRight', 20)}
    </button>
    <div class="mt-8 text-muted">
      <div class="text-4xl font-extrabold text-primary" style="text-shadow: 0 0 30px rgba(16,185,129,0.4);" id="global-co2">0</div>
      <div>Billion tonnes of CO₂ emitted globally per year</div>
    </div>
  `;
  hero.querySelector('.btn-hero-cta').addEventListener('click', () => navigate('calculator'));
  page.appendChild(hero);

  // ─── How It Works ──────────────────────────────────────────────
  const how = document.createElement('section');
  how.className = 'section reveal';
  how.innerHTML = '<h2 class="text-center mb-8">How It Works</h2>';

  const grid3 = document.createElement('div');
  grid3.className = 'grid grid-3';

  HOW_IT_WORKS_STEPS.forEach((step, index) => {
    const card = document.createElement('div');
    card.className = `card text-center stagger-${index + 1} how-card p-8`;
    card.style.background = step.gradient;
    card.style.backdropFilter = 'blur(16px)';
    card.style.border = '1px solid rgba(52,211,153,0.15)';
    card.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)';

    card.innerHTML = `
      <div style="width:80px; height:80px; border-radius:50%; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); display:flex; align-items:center; justify-content:center; margin:0 auto var(--space-5); box-shadow: 0 8px 32px rgba(16,185,129,0.3); animation: float 6s ease-in-out infinite; animation-delay: ${index * 0.5}s; color: white;">
        ${iconSVG(step.icon, 36, 'white')}
      </div>
      <h3 class="mb-3" style="font-size:1.4rem;">${step.title}</h3>
      <p class="text-muted mb-0" style="line-height:1.7;">${step.desc}</p>
    `;
    grid3.appendChild(card);
  });

  how.appendChild(grid3);
  page.appendChild(how);

  // ─── Quick Facts ───────────────────────────────────────────────
  const facts = document.createElement('section');
  facts.className = 'section reveal';
  facts.innerHTML = '<h2 class="text-center mb-8">Why It Matters</h2>';

  const grid4 = document.createElement('div');
  grid4.className = 'grid grid-4';

  STAT_CARDS.forEach((stat, index) => {
    const card = document.createElement('div');
    card.className = `stats-card card stagger-${index + 1} relative overflow-hidden`;

    card.innerHTML = `
      <div style="position:absolute; top:-20px; right:-20px; opacity:0.08; color:${stat.color};">
        ${iconSVG(stat.icon, 120, stat.color)}
      </div>
      <div class="flex-center mb-4" style="width:56px; height:56px; border-radius:50%; background: ${stat.color}20; color:${stat.color};">
        ${iconSVG(stat.icon, 28, stat.color)}
      </div>
      <div class="value counter-animate" data-target="${stat.value}" data-suffix="${stat.suffix}" style="color:${stat.color};">0</div>
      <div class="label">${stat.label}</div>
    `;
    grid4.appendChild(card);
  });

  facts.appendChild(grid4);
  page.appendChild(facts);

  // ─── Impact CTA Section ────────────────────────────────────────
  const impact = document.createElement('section');
  impact.className = 'section reveal text-center';
  impact.innerHTML = `
    <div class="card p-8 relative overflow-hidden" style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.1)); border: 1px solid rgba(52,211,153,0.2);">
      <div style="position:absolute; top:10%; left:5%; opacity:0.06; animation: float 8s ease-in-out infinite;">
        ${iconSVG('Leaf', 200, '#10B981')}
      </div>
      <div style="position:absolute; bottom:10%; right:5%; opacity:0.06; animation: float 10s ease-in-out infinite; animation-delay:2s;">
        ${iconSVG('TreePine', 180, '#34D399')}
      </div>
      <h2 class="relative" style="z-index:1;">What Can <span class="text-accent">YOU</span> Do?</h2>
      <p class="text-muted mx-auto mb-6 relative" style="max-width:600px; z-index:1;">
        Small changes add up. From choosing greener transport to reducing food waste, every action counts towards a healthier planet.
      </p>
      <button class="btn btn-accent relative" style="z-index:1; font-size:1.1rem; padding:var(--space-3) var(--space-6);" onclick="window.location.hash='#/reduce'">
        ${iconSVG('Sparkles', 20)} Explore Reduction Tips
      </button>
    </div>
  `;
  page.appendChild(impact);

  // ─── Mount & Initialize ────────────────────────────────────────
  container.appendChild(page);
  setTimeout(() => createIcons({ root: page }), 50);

  // Scroll-reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.querySelectorAll('.counter-animate').forEach((el) => {
          if (el.dataset.animated) return;
          el.dataset.animated = 'true';
          animateCounter(el, parseFloat(el.dataset.target), el.dataset.suffix || '');
        });
      }
    });
  }, { threshold: 0.15 });

  page.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // Hero counter
  const counterEl = document.getElementById('global-co2');
  if (counterEl) animateCounter(counterEl, 36.8, '');

  // Particle system
  const particleSystem = initParticleSystem(particlesCanvas);

  // 3D tilt effect
  attachTiltEffect(page.querySelectorAll('.how-card'));

  // ─── Cleanup ───────────────────────────────────────────────────
  return () => {
    revealObserver.disconnect();
    particleSystem.cleanup();
  };
}
