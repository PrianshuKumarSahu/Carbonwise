/**
 * @module home
 * @description Home/Landing page module with live animations and inline SVG icons.
 */

import { navigate } from '../router.js';
import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';

export default function render(container) {
  const page = document.createElement('div');
  page.className = 'page-home';

  // ─── FLOATING PARTICLES CANVAS ────────────────────────────────
  const particlesCanvas = document.createElement('canvas');
  particlesCanvas.id = 'particles-canvas';
  particlesCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0.6;';
  page.appendChild(particlesCanvas);

  // ─── HERO SECTION ─────────────────────────────────────────────
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
    <div style="margin-top:var(--space-8); color:var(--color-fg-muted);">
      <div style="font-size:3rem; font-weight:800; color:var(--color-primary); text-shadow: 0 0 30px rgba(16,185,129,0.4);" id="global-co2">0</div>
      <div>Billion tonnes of CO₂ emitted globally per year</div>
    </div>
  `;

  hero.querySelector('.btn-hero-cta').addEventListener('click', () => navigate('calculator'));
  page.appendChild(hero);

  // ─── HOW IT WORKS ─────────────────────────────────────────────
  const how = document.createElement('section');
  how.className = 'section reveal';

  const stepsData = [
    { icon: 'Calculator', title: '1. Calculate', desc: 'Answer simple questions about your transport, energy, diet, and shopping habits.', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,78,59,0.5))' },
    { icon: 'BarChart2', title: '2. Track', desc: 'View your personalized dashboard and see how you compare to global averages.', gradient: 'linear-gradient(135deg, rgba(8,145,178,0.2), rgba(6,78,59,0.5))' },
    { icon: 'TrendingDown', title: '3. Reduce', desc: 'Get actionable, tailored tips to lower your footprint and track your progress.', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(6,78,59,0.5))' }
  ];

  how.innerHTML = `<h2 class="text-center" style="margin-bottom:var(--space-8);">How It Works</h2>`;

  const grid3 = document.createElement('div');
  grid3.className = 'grid grid-3';

  stepsData.forEach((step, index) => {
    const card = document.createElement('div');
    card.className = `card text-center stagger-${index + 1} how-card`;
    card.style.padding = 'var(--space-8) var(--space-6)';
    card.style.background = step.gradient;
    card.style.backdropFilter = 'blur(16px)';
    card.style.border = '1px solid rgba(52,211,153,0.15)';
    card.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)';

    card.innerHTML = `
      <div style="
        width:80px; height:80px; border-radius:50%;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        display:flex; align-items:center; justify-content:center;
        margin:0 auto var(--space-5);
        box-shadow: 0 8px 32px rgba(16,185,129,0.3);
        animation: float 6s ease-in-out infinite;
        animation-delay: ${index * 0.5}s;
        color: white;
      ">
        ${iconSVG(step.icon, 36, 'white')}
      </div>
      <h3 style="margin-bottom:var(--space-3); font-size:1.4rem;">${step.title}</h3>
      <p style="color:var(--color-fg-muted); line-height:1.7; margin:0;">${step.desc}</p>
    `;
    grid3.appendChild(card);
  });

  how.appendChild(grid3);
  page.appendChild(how);

  // ─── QUICK FACTS (Why It Matters) ─────────────────────────────
  const facts = document.createElement('section');
  facts.className = 'section reveal';

  const statCards = [
    { value: 4.7, suffix: 't', label: 'World Average CO₂ per person', icon: 'Globe', color: '#10B981' },
    { value: 15.2, suffix: 't', label: 'US Average CO₂ per person', icon: 'Flag', color: '#F59E0B' },
    { value: 73, suffix: '%', label: 'Of global emissions from energy', icon: 'Zap', color: '#0891B2' },
    { value: 40, suffix: '', label: 'Trees needed to offset 1 tonne', icon: 'TreePine', color: '#34D399' }
  ];

  facts.innerHTML = `<h2 class="text-center" style="margin-bottom:var(--space-8);">Why It Matters</h2>`;

  const grid4 = document.createElement('div');
  grid4.className = 'grid grid-4';

  statCards.forEach((stat, index) => {
    const card = document.createElement('div');
    card.className = `stats-card card stagger-${index + 1}`;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';

    card.innerHTML = `
      <div style="
        position:absolute; top:-20px; right:-20px; opacity:0.08;
        color:${stat.color};
      ">
        ${iconSVG(stat.icon, 120, stat.color)}
      </div>
      <div style="
        width:56px; height:56px; border-radius:50%;
        background: ${stat.color}20;
        display:flex; align-items:center; justify-content:center;
        margin-bottom:var(--space-4); color:${stat.color};
      ">
        ${iconSVG(stat.icon, 28, stat.color)}
      </div>
      <div class="value counter-animate" data-target="${stat.value}" data-suffix="${stat.suffix}" style="color:${stat.color};">0</div>
      <div class="label">${stat.label}</div>
    `;
    grid4.appendChild(card);
  });

  facts.appendChild(grid4);
  page.appendChild(facts);

  // ─── IMPACT CTA SECTION ───────────────────────────────────────
  const impact = document.createElement('section');
  impact.className = 'section reveal text-center';
  impact.innerHTML = `
    <div class="card" style="
      padding: var(--space-12) var(--space-8);
      background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.1));
      border: 1px solid rgba(52,211,153,0.2);
      text-align:center;
      position:relative;
      overflow:hidden;
    ">
      <div style="position:absolute; top:10%; left:5%; opacity:0.06; animation: float 8s ease-in-out infinite;">
        ${iconSVG('Leaf', 200, '#10B981')}
      </div>
      <div style="position:absolute; bottom:10%; right:5%; opacity:0.06; animation: float 10s ease-in-out infinite; animation-delay:2s;">
        ${iconSVG('TreePine', 180, '#34D399')}
      </div>
      <h2 style="position:relative; z-index:1;">What Can <span style="color:var(--color-accent);">YOU</span> Do?</h2>
      <p style="color:var(--color-fg-muted); max-width:600px; margin:0 auto var(--space-6); position:relative; z-index:1;">
        Small changes add up. From choosing greener transport to reducing food waste, every action counts towards a healthier planet.
      </p>
      <button class="btn btn-accent" style="position:relative; z-index:1; font-size:1.1rem; padding:var(--space-3) var(--space-6);" onclick="window.location.hash='#/reduce'">
        ${iconSVG('Sparkles', 20)} Explore Reduction Tips
      </button>
    </div>
  `;
  page.appendChild(impact);

  // ─── MOUNT ────────────────────────────────────────────────────
  container.appendChild(page);

  // Initialize any remaining data-lucide icons
  setTimeout(() => createIcons({ root: page }), 50);

  // ─── INTERSECTION OBSERVER ────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Trigger number counter animations
        entry.target.querySelectorAll('.counter-animate').forEach(el => {
          if (el.dataset.animated) return;
          el.dataset.animated = 'true';
          animateCounter(el, parseFloat(el.dataset.target), el.dataset.suffix || '');
        });
      }
    });
  }, { threshold: 0.15 });

  page.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ─── COUNTER ANIMATIONS ───────────────────────────────────────
  function animateCounter(el, target, suffix) {
    const duration = 2000;
    let start = null;
    const isFloat = target % 1 !== 0;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const val = eased * target;
      el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Hero counter
  const counterEl = document.getElementById('global-co2');
  if (counterEl) animateCounter(counterEl, 36.8, '');

  // ─── PARTICLES ANIMATION ──────────────────────────────────────
  let animId;
  const ctx = particlesCanvas.getContext('2d');

  function resizeCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create particles
  const particles = [];
  const PARTICLE_COUNT = 50;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.3 - 0.2, // drift upward
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.7 ? 45 : 160 // green or amber
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.x < 0) p.x = particlesCanvas.width;
      if (p.x > particlesCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particlesCanvas.height;
      if (p.y > particlesCanvas.height) p.y = 0;

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

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(52, 211, 153, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(drawParticles);
  }

  drawParticles();

  // ─── HOVER TILT EFFECT ON CARDS ───────────────────────────────
  const howCards = page.querySelectorAll('.how-card');
  howCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ─── CLEANUP ──────────────────────────────────────────────────
  return () => {
    observer.disconnect();
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resizeCanvas);
  };
}
