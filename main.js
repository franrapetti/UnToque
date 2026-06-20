/* ============================================
   UnToque — Clean Landing Page Interactions
   ============================================ */

// ---- Password Gate ----
(function() {
  const PASS = '67420';
  const KEY = 'untoque_auth';

  // If already authenticated this session, skip
  if (sessionStorage.getItem(KEY) === 'true') {
    const gate = document.getElementById('password-gate');
    if (gate) gate.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const gate = document.getElementById('password-gate');
    const input = document.getElementById('password-input');
    const btn = document.getElementById('password-btn');
    const error = document.getElementById('password-error');

    if (!gate || sessionStorage.getItem(KEY) === 'true') return;

    function tryUnlock() {
      if (input.value === PASS) {
        sessionStorage.setItem(KEY, 'true');
        gate.classList.add('hidden');
        setTimeout(() => { gate.style.display = 'none'; }, 600);
      } else {
        input.classList.add('shake');
        error.classList.add('visible');
        setTimeout(() => { input.classList.remove('shake'); }, 500);
        setTimeout(() => { error.classList.remove('visible'); }, 2500);
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  // ---- Nav scroll ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ---- 3D Card cursor tilt ----
  const heroCard = document.getElementById('hero-card');
  const heroSection = document.getElementById('hero');

  if (heroCard && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      heroCard.classList.add('is-tracking');
      const rect = heroSection.getBoundingClientRect();
      const normalX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const normalY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      const baseScale = window.innerWidth <= 1024 ? 1.3 : 2.3;
      heroCard.style.transform = `scale(${baseScale}) rotateX(${60 - normalY * 15}deg) rotateZ(-30deg) rotateY(${normalX * 20}deg)`;
      heroCard.style.animationPlayState = 'paused';
    });

    heroSection.addEventListener('mouseleave', () => {
      heroCard.classList.remove('is-tracking');
      heroCard.style.transform = '';
      heroCard.style.animationPlayState = 'running';
    });
  }

  // ---- Scroll Reveal ----
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---- Smooth anchor scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  // ---- Mobile menu ----
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  let menuOpen = false;

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      if (menuOpen) {
        navLinks.style.cssText = 'display:flex; flex-direction:column; position:fixed; top:78px; left:16px; right:16px; background:rgba(255,255,255,0.97); backdrop-filter:blur(20px); padding:20px 24px; gap:16px; border:1px solid rgba(0,0,0,0.06); border-radius:20px; box-shadow:0 8px 32px rgba(0,0,0,0.08); z-index:999;';
      } else {
        navLinks.style.cssText = '';
      }
    });
  }

  // ---- Card hover glow (light) ----
  const glowTargets = document.querySelectorAll('.bento-card, .step-card, .testimonial-card');
  glowTargets.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, rgba(119, 2, 253, 0.15) 0%, rgba(255, 255, 255, 0.0) 60%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  // ---- Usecase card hover ----
  document.querySelectorAll('.usecase-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.background = `radial-gradient(circle 120px at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(119, 2, 253, 0.1) 0%, rgba(255, 255, 255, 0.0) 60%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  // ---- Showcase light follow ----
  document.querySelectorAll('.showcase__item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const r = item.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      item.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(119, 2, 253, 0.1) 0%, rgba(255, 255, 255, 0.0) 50%)`;
    });
    item.addEventListener('mouseleave', () => { item.style.background = ''; });
  });

  // ---- Admin mockup field cycling ----
  const adminFields = document.querySelectorAll('.admin-mockup__field');
  let fieldIdx = 2;
  setInterval(() => {
    adminFields.forEach(f => f.classList.remove('admin-mockup__field--active'));
    fieldIdx = (fieldIdx + 1) % adminFields.length;
    adminFields[fieldIdx].classList.add('admin-mockup__field--active');
  }, 3000);

  // ---- Magnetic Button & Press Micro-interaction ----
  // (Effect removed as requested)
  // ---- Testimonial subtle tilt ----
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const nX = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const nY = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(600px) rotateY(${nX * 2}deg) rotateX(${-nY * 2}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  console.log('✦ UnToque — loaded');
});
