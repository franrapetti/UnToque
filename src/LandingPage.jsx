import React, { useEffect, useState } from 'react';
import '../style.css';
import logoSvg from '../logo.svg';
import standImage from '../Smart Tap Branding (2).png';

const LandingPage = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  // Preloader logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Accordion logic using useEffect (attaching event listeners to DOM elements)
  useEffect(() => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    const handleAccordionClick = (e) => {
      const header = e.currentTarget;
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const icon = item.querySelector('.accordion-icon');
      
      const isActive = item.classList.contains('active');
      
      // Close all other items in this accordion
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(accItem => {
          accItem.classList.remove('active');
          const accBody = accItem.querySelector('.accordion-body');
          const accIcon = accItem.querySelector('.accordion-icon');
          if (accBody) accBody.style.display = 'none';
          if (accIcon) accIcon.textContent = '+';
        });
      }

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        if (body) body.style.display = 'block';
        if (icon) icon.textContent = '−';
      }
    };

    accordionHeaders.forEach(header => {
      header.addEventListener('click', handleAccordionClick);
    });

    return () => {
      accordionHeaders.forEach(header => {
        header.removeEventListener('click', handleAccordionClick);
      });
    };
  }, []);

  return (
    <div className="landing-scope">
      {/* Preloader */}
      {showPreloader && (
        <div id="preloader" className="preloader">
            <div className="preloader-content">
                <span className="static-text">Conexión </span>
                <span className="dynamic-wrapper">
                    <span className="dynamic-text">Instantánea</span>
                    <span className="dynamic-text">Invisible</span>
                    <span className="dynamic-text">Sin fricción</span>
                </span>
            </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="top-banner">
          <div className="container">
              <p>HIGHLIGHT SOCIAL PROOF, REDUCTION OF FUDS (FEAR, UNCERTAINTY, DOUBTS), OR UNIQUE OFFER (i.e - Free Shipping, Money Back Guarantee, etc)</p>
          </div>
      </div>

      {/* Header */}
      <header className="header">
          <div className="container header-container">
              <a href="/" className="logo-link">
                  <img src={logoSvg} alt="UnToque Logo" className="logo" />
              </a>
              <nav className="main-nav">
                  <ul className="nav-links">
                      <li><a href="#">Anchor 1</a></li>
                      <li><a href="#">Anchor 2</a></li>
                      <li><a href="#">Anchor 3</a></li>
                      <li><a href="#">Anchor 4</a></li>
                  </ul>
              </nav>
              <div className="header-actions">
                  <button className="icon-btn" aria-label="User Account">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </button>
                  <button className="icon-btn" aria-label="Search">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>
                  <button className="icon-btn cart-btn" aria-label="Cart">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                      <span className="cart-badge">0</span>
                  </button>
              </div>
          </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
          <div className="container hero-container">
              <div className="hero-content">
                  <span className="hero-tagline">Para negocios que quieren ser elegidos</span>
                  <h1 className="hero-title text-display">Más&nbsp;Reseñas.<br />Más&nbsp;Confianza.<br />Más&nbsp;Clientes.</h1>
                  <p className="hero-body text-body">Las reseñas influyen en qué negocios ganan visibilidad, confianza y clientes. Si tus clientes felices no opinan, esa señal se pierde. UnToque hace que dejar una reseña sea inmediato, medible y simple desde tu mostrador.</p>
                  <div className="hero-cta-group">
                      <button className="btn btn-primary btn-large">Empezar a captar reseñas</button>
                      <p className="hero-microcopy">Sin apps. Sin complicaciones. Stand NFC listo para usar desde tu mostrador.</p>
                  </div>
              </div>
              <div className="hero-visual">
                  <div className="stand-wrapper">
                      <img src={standImage} alt="Stand UnToque NFC" className="stand-image" />
                  </div>
              </div>
          </div>
      </section>

      {/* Social Proof Logos */}
      <section className="social-proof-logos">
          <div className="container">
              <div className="logos-placeholder text-display">SOCIAL PROOF (Client logos)</div>
          </div>
      </section>

      {/* Feature 1 */}
      <section className="feature-split">
          <div className="container feature-split-container">
              <div className="feature-content">
                  <h2 className="text-display feature-title">Tus clientes se van felices, pero la señal que podría posicionarte se pierde</h2>
                  <p className="text-body feature-body">Atendés bien, resolvés, vendés y generás buenas experiencias. Pero si esas experiencias no se convierten en reseñas, quedan invisibles para quienes buscan, comparan y eligen negocios todos los días.</p>
                  <button className="btn btn-secondary">Ver cómo funciona</button>
              </div>
              <div className="feature-visual">
                  <div className="visual-placeholder">
                      <p className="text-body placeholder-text"><strong>Image or video</strong> that helps reinforce core value proposition and articulate what it is you do.</p>
                      <div className="placeholder-details">
                          <p className="text-body"><strong>Make sure to fulfill all 3 buying dimensions:</strong></p>
                          <ul className="text-body">
                              <li><strong>Functional:</strong> "What it does—solves a specific problem or makes life easier."</li>
                              <li><strong>Emotional:</strong> "How it makes them feel—confident, secure, or excited."</li>
                              <li><strong>Social:</strong> "How it makes them look—enhances status, image, or belonging."</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
          <div className="container">
              <h2 className="text-display text-center section-title">¿Cómo funciona?</h2>
              <div className="steps-grid">
                  <div className="step-card">
                      <h3 className="text-display step-title">El cliente acerca su celular</h3>
                      <p className="text-body step-desc">El stand NFC activa el enlace desde tu mostrador.</p>
                  </div>
                  <div className="step-card">
                      <h3 className="text-display step-title">Deja una reseña positiva</h3>
                      <p className="text-body step-desc">Sin buscar tu negocio ni esperar a que se acuerde después.</p>
                  </div>
                  <div className="step-card">
                      <h3 className="text-display step-title">Ganás visibilidad</h3>
                      <p className="text-body step-desc"></p>
                  </div>
              </div>
              <div className="text-center cta-wrapper">
                  <button className="btn btn-primary btn-large">Comprar stand</button>
              </div>
          </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="value-prop">
          <div className="container value-prop-container">
              <h2 className="text-display text-center section-title">No es solo pedir reseñas. Es capturarlas en el momento correcto.</h2>
              <div className="social-proof-banner text-display">Social Proof</div>
              <div className="benefits-row">
                  <div className="benefit-item"><div className="benefit-icon">Icon</div><span className="text-body">Más reseñas reales</span></div>
                  <div className="benefit-item"><div className="benefit-icon">Icon</div><span className="text-body">Más visibilidad local</span></div>
                  <div className="benefit-item"><div className="benefit-icon">Icon</div><span className="text-body">Más confianza online</span></div>
                  <div className="benefit-item"><div className="benefit-icon">Icon</div><span className="text-body">Uso Medible</span></div>
                  <div className="benefit-item"><div className="benefit-icon">Icon</div><span className="text-body">Desde el Mostrador</span></div>
                  <div className="benefit-item"><div className="benefit-icon">Icon</div><span className="text-body">Sin Apps</span></div>
              </div>
          </div>
      </section>

      {/* Feature 2 */}
      <section className="feature-split feature-reverse">
          <div className="container feature-split-container">
              <div className="feature-visual">
                  <div className="visual-placeholder">
                      <p className="text-body placeholder-text text-center"><strong>Image or video</strong> that complements and reinforce core value proposition</p>
                  </div>
              </div>
              <div className="feature-content">
                  <h2 className="text-display feature-title">Convertí cada buena experiencia en una reseña visible</h2>
                  <p className="text-body feature-body">Tus clientes ya confían en vos cuando salen contentos. UnToque hace que ese momento se transforme en una reseña real, desde tu mostrador y en segundos.</p>
                  <button className="btn btn-primary">Captar más reseñas</button>
              </div>
          </div>
      </section>

      {/* Feature 3: Accordion */}
      <section className="feature-split">
          <div className="container feature-split-container">
              <div className="feature-content">
                  <h2 className="text-display feature-title">Tu mostrador puede hacer más que vender</h2>
                  <div className="accordion">
                      <div className="accordion-item active">
                          <div className="accordion-header"><h3 className="text-display">Captura el momento</h3><span className="accordion-icon">−</span></div>
                          <div className="accordion-body text-body">Description of benefit</div>
                      </div>
                      <div className="accordion-item">
                          <div className="accordion-header"><h3 className="text-display">Genera confianza</h3><span className="accordion-icon">+</span></div>
                          <div className="accordion-body text-body" style={{ display: 'none' }}>Description of benefit</div>
                      </div>
                      <div className="accordion-item">
                          <div className="accordion-header"><h3 className="text-display">Mide interacciones</h3><span className="accordion-icon">+</span></div>
                          <div className="accordion-body text-body" style={{ display: 'none' }}>Description of benefit</div>
                      </div>
                  </div>
                  <div style={{ marginTop: '32px' }}><button className="btn btn-primary">SHOP NOW</button></div>
              </div>
              <div className="feature-visual">
                  <div className="visual-placeholder">
                      <p className="text-body placeholder-text text-center"><strong>Image or video</strong> that complements and reinforce core value proposition</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Products */}
      <section className="products">
          <div className="container">
              <h2 className="text-display text-center section-title">Product Categories</h2>
              <div className="products-grid">
                  <div className="product-card">
                      <div className="product-image-placeholder text-body">Image of Product</div>
                      <div className="product-info">
                          <div className="product-rating"><span className="stars">★★★★★</span> <span className="text-body" style={{ fontSize: '12px', opacity: 0.7 }}>4.8 (21 Reviews)</span></div>
                          <h3 className="text-display">Category Name</h3>
                          <p className="text-body product-desc">Short 2-3 sentence description of your product category</p>
                          <button className="btn btn-primary product-btn">ADD TO CART - ($PRICE)</button>
                      </div>
                  </div>
                  <div className="product-card">
                      <div className="product-image-placeholder text-body">Image of Product</div>
                      <div className="product-info">
                          <div className="product-rating"><span className="stars">★★★★★</span> <span className="text-body" style={{ fontSize: '12px', opacity: 0.7 }}>4.8 (21 Reviews)</span></div>
                          <h3 className="text-display">Category Name</h3>
                          <p className="text-body product-desc">Short 2-3 sentence description of your product category</p>
                          <button className="btn btn-primary product-btn">ADD TO CART - ($PRICE)</button>
                      </div>
                  </div>
                  <div className="product-card">
                      <div className="product-image-placeholder text-body">Image of Product</div>
                      <div className="product-info">
                          <div className="product-rating"><span className="stars">★★★★★</span> <span className="text-body" style={{ fontSize: '12px', opacity: 0.7 }}>4.8 (21 Reviews)</span></div>
                          <h3 className="text-display">Category Name</h3>
                          <p className="text-body product-desc">Short 2-3 sentence description of your product category</p>
                          <button className="btn btn-primary product-btn">ADD TO CART - ($PRICE)</button>
                      </div>
                  </div>
                  <div className="product-card">
                      <div className="product-image-placeholder text-body">Image of Product</div>
                      <div className="product-info">
                          <div className="product-rating"><span className="stars">★★★★★</span> <span className="text-body" style={{ fontSize: '12px', opacity: 0.7 }}>4.8 (21 Reviews)</span></div>
                          <h3 className="text-display">Category Name</h3>
                          <p className="text-body product-desc">Short 2-3 sentence description of your product category</p>
                          <button className="btn btn-primary product-btn">ADD TO CART - ($PRICE)</button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Social Proof 2 */}
      <section className="social-proof-testimonials">
          <div className="container value-prop-container">
              <h2 className="text-display text-center section-title" style={{ marginBottom: '24px' }}>Social Proof Section (UGC, Stats, Testimonials, Reviews, etc.)</h2>
              <div className="social-proof-banner text-display" style={{ marginBottom: '32px' }}>Social Proof</div>
              <div className="text-center"><button className="btn btn-primary">MAIN ACTION TO TAKE</button></div>
          </div>
      </section>

      {/* Features Grid */}
      <section className="vida-real-features">
          <div className="container">
              <h2 className="text-display text-center section-title" style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>Todo pensado para que funcione en la vida real de tu negocio</h2>
              <div className="vida-real-grid">
                  <div className="vida-real-card"><h3 className="text-display">Listo para activar</h3><p className="text-body">Te guiamos para cargar tu enlace y probar que funcione correctamente.</p></div>
                  <div className="vida-real-card"><h3 className="text-display">Sin pasos raros</h3><p className="text-body">El cliente solo acerca el celular y deja una reseña.</p></div>
                  <div className="vida-real-card"><h3 className="text-display">No frena la atención</h3><p className="text-body">Se integra al mostrador sin cambiar tu forma de vender.</p></div>
                  <div className="vida-real-card"><h3 className="text-display">Destino editable</h3><p className="text-body">Podés actualizar el enlace sin cambiar el chip ni reemplazar el stand.</p></div>
                  <div className="vida-real-card"><h3 className="text-display">No es un accesorio suelto</h3><p className="text-body">Incluye stand, NFC, redirección, métricas, guía y soporte inicial.</p></div>
                  <div className="vida-real-card"><h3 className="text-display">Sin esperas, sin fricción</h3><p className="text-body">El modelo estándar está pensado para entrega rápida y uso inmediato.</p></div>
              </div>
              <div className="text-center cta-wrapper"><button className="btn btn-primary btn-large">MAIN ACTION TO TAKE</button></div>
          </div>
      </section>

      {/* Feature 4: SEO */}
      <section className="feature-split">
          <div className="container feature-split-container">
              <div className="feature-content">
                  <h2 className="text-display feature-title">Aparecé con más fuerza cuando tus próximos clientes busquen negocios como el tuyo</h2>
                  <p className="text-body feature-body">Las reseñas no sólo suman opiniones. También construyen señales públicas que ayudan a que tu negocio se vea más activo, confiable y competitivo cuando alguien compara opciones.</p>
                  <div className="seo-grid">
                      <div className="seo-item"><div className="seo-icon"></div><h4 className="text-display">Más reseñas reales</h4><p className="text-body" style={{ fontSize: '14px' }}>Convertí clientes felices en opiniones visibles para quienes todavía no te conocen.</p></div>
                      <div className="seo-item"><div className="seo-icon"></div><h4 className="text-display">Mejor primera impresión</h4><p className="text-body" style={{ fontSize: '14px' }}>Mostrá una reputación más activa cuando te encuentren.</p></div>
                      <div className="seo-item"><div className="seo-icon"></div><h4 className="text-display">Más motivos para elegirte</h4><p className="text-body" style={{ fontSize: '14px' }}>Ayudá al cliente a confiar antes de contactarte.</p></div>
                      <div className="seo-item"><div className="seo-icon"></div><h4 className="text-display">Menos oportunidades perdidas</h4><p className="text-body" style={{ fontSize: '14px' }}>No dependas de que el cliente recuerde opinar después.</p></div>
                  </div>
                  <div style={{ marginTop: '32px' }}><button className="btn btn-primary">Activar mi stand NFC</button></div>
              </div>
              <div className="feature-visual">
                  <div className="visual-placeholder">
                      <p className="text-body placeholder-text text-center"><strong>Image or video</strong> that complements and reinforce core value proposition</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
          <div className="container">
              <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 0' }}>
                  <h2 className="text-display feature-title">Tu stand NFC, activo y funcionando desde el primer día</h2>
                  <p className="text-body feature-body" style={{ margin: '0 auto 32px auto' }}>No necesitás saber de tecnología, configurar sistemas complejos ni perseguir clientes por WhatsApp. Te guiamos para activar tu UnToque, cargar tu enlace de reseña y verificar que funcione correctamente antes de usarlo en tu mostrador.</p>
                  <button className="btn btn-primary btn-large">Activar mi stand NFC</button>
              </div>
          </div>
      </section>

      {/* Social Proof 3 */}
      <section className="social-proof-testimonials">
          <div className="container value-prop-container">
              <h2 className="text-display text-center section-title" style={{ marginBottom: '24px' }}>Social Proof Section (UGC, Stats, Testimonials, Reviews, etc.)</h2>
              <div className="social-proof-banner text-display" style={{ marginBottom: '32px' }}>Social Proof</div>
              <div className="text-center"><button className="btn btn-primary">MAIN ACTION TO TAKE</button></div>
          </div>
      </section>

      {/* FAQ */}
      <section className="faq">
          <div className="container" style={{ maxWidth: '800px' }}>
              <h2 className="text-display text-center section-title">Frequently Asked Questions</h2>
              <div className="accordion">
                  <div className="accordion-item active">
                      <div className="accordion-header"><h3 className="text-display">Question #1</h3><span className="accordion-icon">−</span></div>
                      <div className="accordion-body text-body">Answer #1</div>
                  </div>
                  <div className="accordion-item">
                      <div className="accordion-header"><h3 className="text-display">Question #2</h3><span className="accordion-icon">+</span></div>
                      <div className="accordion-body text-body" style={{ display: 'none' }}>Answer #2</div>
                  </div>
                  <div className="accordion-item">
                      <div className="accordion-header"><h3 className="text-display">Question #3</h3><span className="accordion-icon">+</span></div>
                      <div className="accordion-body text-body" style={{ display: 'none' }}>Answer #3</div>
                  </div>
                  <div className="accordion-item">
                      <div className="accordion-header"><h3 className="text-display">Question #4</h3><span className="accordion-icon">+</span></div>
                      <div className="accordion-body text-body" style={{ display: 'none' }}>Answer #4</div>
                  </div>
              </div>
              <div className="text-center cta-wrapper"><button className="btn btn-primary">MAIN ACTION TO TAKE</button></div>
          </div>
      </section>

      {/* Bottom Banner */}
      <section className="bottom-banner">
          <div className="container text-center">
              <h2 className="text-display">Tus clientes ya confían en vos. Hacé que otros también lo vean.</h2>
              <p className="text-body" style={{ margin: '16px auto 32px auto', maxWidth: '600px' }}>Si tu negocio ya genera buenas experiencias, no dejes que se vayan sin convertirse en reputación visible.</p>
              <button className="btn" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)', padding: '12px 24px', fontSize: '16px' }}>Conseguir UnToque</button>
          </div>
      </section>

      <footer className="footer">
          <div className="container">
              <h2 className="text-display text-center">Footer</h2>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
