const fs = require('fs');

let css = fs.readFileSync('index.css', 'utf-8');

// 1. Dark mode palette
css = css.replace(/:root \{([\s\S]*?)\}/, `:root {
  --brand: #7702fd;
  --brand-accent: #9d4edd;
  --brand-light: #5e01cc;
  --brand-lighter: #8b5cf6;
  --brand-pale: rgba(119, 2, 253, 0.1);
  --brand-surface: rgba(119, 2, 253, 0.05);
  --brand-subtle: rgba(119, 2, 253, 0.1);
  --brand-glow: rgba(119, 2, 253, 0.4);

  --white: #ffffff;
  --bg: #050508;
  --bg-alt: #0a0a0e;
  --bg-warm: #08080b;

  --gray-950: #f5f5f6;
  --gray-900: #e0e0e6;
  --gray-800: #c2c2cc;
  --gray-700: #a5a5b5;
  --gray-600: #888899;
  --gray-500: #666675;
  --gray-400: #44444d;
  --gray-300: #33333a;
  --gray-200: #25252b;
  --gray-100: #1a1a1e;
  --gray-50: #0f0f10;

  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Inter', sans-serif;
  --font-logo: 'Syne', sans-serif;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  --container: 1140px;
  --container-wide: 1280px;
  --gutter: clamp(20px, 5vw, 64px);
  --section-gap: clamp(80px, 10vw, 140px);
  --radius: 16px;
  --radius-sm: 10px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 100px;
}`);

// 2. Global body background
css = css.replace(/body \{\s*font-family: var\(--font\);\s*color: var\(--gray-700\);\s*background: var\(--white\);/g, 
`body {
  font-family: var(--font);
  color: var(--gray-700);
  background: var(--bg);`);

// 3. Section Backgrounds (fixing the checkerboard issue)
const sectionBgs = ['.benefits', '.usecases', '.trust-and-logos', '.solution', '.footer', '.showcase', '.redirection', '.social-proof', '.problem'];
for (const sec of sectionBgs) {
  css = css.replace(new RegExp(`\\${sec}\\s*\\{\\s*background:\\s*var\\(--[a-zA-Z-]+\\);\\s*\\}`, 'g'), `${sec} { background: var(--bg); }`);
}

css = css.replace(/\.trust-and-logos\s*\{\s*position:\s*relative;\s*z-index:\s*5;\s*background:\s*var\(--white\);/g, 
  '.trust-and-logos {\n  position: relative;\n  z-index: 5;\n  background: var(--bg);');

css = css.replace(/\.footer\s*\{\s*background:\s*var\(--white\);/g, '.footer {\n  background: var(--bg);');

// 4. Cards to Glassmorphism
const cardGlass = `background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);`;

const cardHoverGlass = `background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);`;

// .bento-card
css = css.replace(/\.bento-card\s*\{[\s\S]*?overflow:\s*hidden;\s*\}/, 
`.bento-card {
  position: relative;
  padding: 64px 48px;
  ${cardGlass}
  border-radius: var(--radius-xl);
  transition: all 0.35s var(--ease-smooth);
  overflow: hidden;
}`);
css = css.replace(/\.bento-card:hover\s*\{[\s\S]*?\}/, `.bento-card:hover { ${cardHoverGlass} }`);

// .step-card
css = css.replace(/\.step-card\s*\{[\s\S]*?transition:\s*all\s*0\.35s\s*var\(--ease-smooth\);\s*\}/, 
`.step-card {
  position: relative;
  padding: 64px 48px;
  ${cardGlass}
  border-radius: var(--radius-lg);
  transition: all 0.35s var(--ease-smooth);
}`);
css = css.replace(/\.step-card:hover\s*\{[\s\S]*?\}/, `.step-card:hover { ${cardHoverGlass} }`);

// .usecase-card
css = css.replace(/\.usecase-card\s*\{[\s\S]*?text-align:\s*center;\s*\}/, 
`.usecase-card {
  padding: 48px 32px;
  ${cardGlass}
  border-radius: var(--radius-lg);
  transition: all 0.35s ease;
  text-align: center;
}`);
css = css.replace(/\.usecase-card:hover\s*\{[\s\S]*?\}/, `.usecase-card:hover { ${cardHoverGlass} }`);

// .testimonial-card
css = css.replace(/\.testimonial-card\s*\{[\s\S]*?transition:\s*all\s*0\.35s\s*ease;\s*\}/, 
`.testimonial-card {
  padding: 56px 48px;
  ${cardGlass}
  border-radius: var(--radius-xl);
  transition: all 0.35s ease;
}`);
css = css.replace(/\.testimonial-card:hover\s*\{[\s\S]*?\}/, `.testimonial-card:hover { ${cardHoverGlass} }`);

// .trust-badge
css = css.replace(/\.trust-badge\s*\{[\s\S]*?transition:\s*all\s*0\.3s\s*ease;\s*\}/, 
`.trust-badge {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 64px 48px;
  ${cardGlass}
  border-radius: 24px;
  transition: all 0.3s ease;
}`);

// .admin-mockup
css = css.replace(/\.admin-mockup\s*\{[\s\S]*?box-shadow:\s*0\s*2px\s*8px\s*rgba\(0,0,0,0\.02\);\s*\}/, 
`.admin-mockup {
  ${cardGlass}
  border-radius: var(--radius-xl);
  padding: 32px;
}`);

css = css.replace(/\.admin-mockup__field\s*\{[\s\S]*?border-radius:\s*var\(--radius-sm\);\s*display:\s*flex;/g, 
`.admin-mockup__field {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  display: flex;`);

// .showcase__item
css = css.replace(/\.showcase__item\s*\{[\s\S]*?transition:\s*all\s*0\.35s\s*ease;\s*\}/, 
`.showcase__item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4/3;
  ${cardGlass}
  transition: all 0.35s ease;
}`);

// 5. Nav Glassmorphism
css = css.replace(/\.nav\s*\{[\s\S]*?transition:\s*all\s*0\.35s\s*var\(--ease-smooth\);\s*\}/, 
`.nav {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 48px);
  max-width: 1100px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  background: rgba(10, 10, 14, 0.6);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  transition: all 0.35s var(--ease-smooth);
}`);

css = css.replace(/\.nav\.scrolled\s*\{[\s\S]*?\}/, 
`.nav.scrolled {
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.6);
  background: rgba(5, 5, 8, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
}`);

// 6. Hero Mesh Gradient
css = css.replace(/\.hero\s*\{\s*position:\s*relative;\s*padding:\s*150px\s*0\s*60px;\s*background:\s*radial-gradient[\s\S]*?overflow:\s*hidden;\s*\}/, 
`.hero {
  position: relative;
  padding: 150px 0 60px;
  background: var(--bg);
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -20%; left: -10%;
  width: 50vw; height: 50vh;
  background: radial-gradient(circle, rgba(157, 78, 221, 0.15) 0%, transparent 70%);
  filter: blur(80px);
  z-index: 1;
  pointer-events: none;
}`);

css = css.replace(/\.hero__badge\s*\{[\s\S]*?opacity:\s*0;\s*\}/, 
`.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px 8px 12px;
  background: rgba(119, 2, 253, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(119, 2, 253, 0.3);
  border-radius: var(--radius-pill);
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(119, 2, 253, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.7s var(--ease-out) forwards;
  opacity: 0;
}`);

css = css.replace(/\.chip\s*\{[\s\S]*?font-weight:\s*600;\s*\}/, 
`.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  color: var(--gray-700);
  font-weight: 600;
}`);

// 7. Password Gate
css = css.replace(/\.password-gate\s*\{[\s\S]*?transition:\s*opacity\s*0\.5s\s*ease,\s*visibility\s*0\.5s\s*ease;\s*\}/, 
`.password-gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1a1a2e 0%, var(--bg) 100%);
  transition: opacity 0.5s ease, visibility 0.5s ease;
}`);

css = css.replace(/\.password-gate__card\s*\{[\s\S]*?text-align:\s*center;\s*\}/, 
`.password-gate__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 48px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.05);
  max-width: 400px;
  width: calc(100% - 48px);
  text-align: center;
}`);

css = css.replace(/\.password-gate__input\s*\{[\s\S]*?text-align:\s*center;\s*\}/, 
`.password-gate__input {
  flex: 1;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font);
  color: var(--white);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  letter-spacing: 0.15em;
  text-align: center;
}`);

// 8. Buttons
css = css.replace(/\.btn-secondary\s*\{[\s\S]*?box-shadow:\s*0\s*2px\s*8px\s*rgba\(0,0,0,0\.02\);\s*\}/, 
`.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  color: var(--white);
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}`);

css = css.replace(/\.btn-secondary:hover\s*\{[\s\S]*?\}/, 
`.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}`);

// 9. Logos inversion
css = css.replace(/\.logo-img\s*\{[\s\S]*?user-select:\s*none;\s*\}/, 
`.logo-img {
  height: 38px;
  max-width: 140px;
  object-fit: contain;
  filter: grayscale(100%) contrast(0%) brightness(200%) invert(1);
  mix-blend-mode: screen;
  opacity: 0.6;
  transition: all 0.3s ease;
  user-select: none;
}`);

css = css.replace(/\.logo-img:hover\s*\{[\s\S]*?transform:\s*scale\(1\.05\);\s*\}/, 
`.logo-img:hover {
  opacity: 1;
  filter: grayscale(100%) contrast(0%) brightness(300%) invert(1);
  transform: scale(1.05);
}`);

css = css.replace(/\.nav__logo img\s*\{\s*height:\s*44px;\s*width:\s*auto;\s*object-fit:\s*contain;\s*\}/, 
`.nav__logo img { height: 44px; width: auto; object-fit: contain; filter: invert(1) brightness(2); }`);

css = css.replace(/\.footer__logo img\s*\{\s*height:\s*82px;\s*width:\s*auto;\s*object-fit:\s*contain;\s*\}/, 
`.footer__logo img { height: 82px; width: auto; object-fit: contain; filter: invert(1) brightness(2); }`);

// 10. Fix light-card-img mix-blend-mode
css = css.replace(/\.light-card-img\s*\{\s*mix-blend-mode:\s*multiply;\s*\/\*[\s\S]*?\*\/\s*\}/, 
`.light-card-img { mix-blend-mode: normal; }`);

// 11. Final CTA
css = css.replace(/\.final-cta\s*\{[\s\S]*?overflow:\s*hidden;\s*\}/, 
`.final-cta {
  position: relative;
  background: radial-gradient(circle at center, rgba(119, 2, 253, 0.1) 0%, var(--bg) 100%);
  padding: clamp(100px, 12vw, 140px) 0;
  overflow: hidden;
}`);

// 12. Fix Whatsapp button
css = css.replace(/\.btn-whatsapp\s*\{[\s\S]*?box-shadow:\s*0\s*4px\s*12px\s*rgba\(0,0,0,0\.03\);\s*\}/, 
`.btn-whatsapp {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: rgba(37, 211, 102, 0.1);
  border: 1px solid rgba(37, 211, 102, 0.3);
  color: var(--white);
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: var(--radius-pill);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}`);

css = css.replace(/\.btn-whatsapp:hover\s*\{[\s\S]*?color:\s*#15803d;\s*\}/, 
`.btn-whatsapp:hover {
  background: rgba(37, 211, 102, 0.2);
  border-color: rgba(37, 211, 102, 0.5);
  color: var(--white);
}`);


// Add magnetic button CSS to prevent stutter (remove transition on transform)
css += `
/* Add class to disable transition during magnetic hover to prevent stuttering */
.no-transform-transition {
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease !important;
}
`;

fs.writeFileSync('index.css', css);

// Fix main.js magnetic buttons to avoid stuttering
let js = fs.readFileSync('main.js', 'utf-8');

js = js.replace(/\/\/ ---- Button press micro-interaction ----[\s\S]*?\}\);/m, 
`// ---- Magnetic Button & Press Micro-interaction ----
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-whatsapp, .nav__cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      btn.classList.add('no-transform-transition');
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = \`translate(\${x * 0.3}px, \${y * 0.3}px) scale(1.02)\`;
    });
    btn.addEventListener('mousedown', () => { btn.style.transform += ' scale(0.95)'; });
    btn.addEventListener('mouseup', () => { btn.style.transform = btn.style.transform.replace(' scale(0.95)', ''); });
    btn.addEventListener('mouseleave', () => { 
      btn.style.transform = 'translate(0px, 0px) scale(1)'; 
      setTimeout(() => btn.classList.remove('no-transform-transition'), 50);
    });
  });`);

// Update glow logic for dark mode
js = js.replace(/radial-gradient\(circle 220px at \$\{x\}px \$\{y\}px, rgba\(119, 2, 253, 0\.035\) 0%, var\(--white\) 60%\)/g, 
  'radial-gradient(circle 250px at ${x}px ${y}px, rgba(119, 2, 253, 0.15) 0%, rgba(255, 255, 255, 0.0) 60%)');

js = js.replace(/radial-gradient\(circle 100px at \$\{e\.clientX - r\.left\}px \$\{e\.clientY - r\.top\}px, rgba\(119, 2, 253, 0\.05\) 0%, var\(--white\) 60%\)/g, 
  'radial-gradient(circle 120px at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(119, 2, 253, 0.1) 0%, rgba(255, 255, 255, 0.0) 60%)');

js = js.replace(/radial-gradient\(circle at \$\{x\}% \$\{y\}%, rgba\(119, 2, 253, 0\.04\) 0%, var\(--bg-alt\) 50%\)/g, 
  'radial-gradient(circle at ${x}% ${y}%, rgba(119, 2, 253, 0.1) 0%, rgba(255, 255, 255, 0.0) 50%)');

fs.writeFileSync('main.js', js);
console.log('Refactor complete!');
