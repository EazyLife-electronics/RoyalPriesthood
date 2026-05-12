/* ── CONFIG: replace with your real WhatsApp number ── */
const WA_NUMBER = '234XXXXXXXXXX';

/* ── LOAD SERVICES FROM services.json ── */
async function loadServices() {
  try {
    const res = await fetch('services.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const services = await res.json();

    const grid   = document.getElementById('services-grid');
    const select = document.getElementById('service-select');

    // Use s.title, s.desc, s.price, s.icon, s.message — matching the JSON exactly
    grid.innerHTML = services.map((s, i) => `
      <div class="service-card" data-index="${i}">
        <div class="service-num">0${i + 1}</div>
        <div class="service-icon-wrap">${s.icon}</div>
        <h3 class="service-name">${s.title}</h3>
        <p class="service-desc">${s.desc}</p>
        <div class="service-price">${s.price}</div>
        <a class="btn-wa-service"
           href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(s.message)}"
           target="_blank">
          <i class="fab fa-whatsapp"></i> Book This Service
        </a>
      </div>
    `).join('');

    // Populate booking dropdown
    select.innerHTML = services.map(s =>
      `<option value="${s.title}">${s.title} — ${s.price}</option>`
    ).join('');

    // Staggered card reveal
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index || 0);
          setTimeout(() => entry.target.classList.add('visible'), idx * 80);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.service-card').forEach(el => cardObserver.observe(el));

    // Reveal contact form
    const formObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    const form = document.getElementById('contactForm');
    if(form) formObserver.observe(form);

  } catch (err) {
    console.error('Failed to load services.json:', err);
    const grid = document.getElementById('services-grid');
    if(grid) grid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;padding:60px 24px;font-family:'Cinzel',serif;font-size:12px;letter-spacing:.3em;color:var(--muted);text-transform:uppercase;">
        Unable to load services. Please contact us directly on WhatsApp.
      </p>`;
  }
}

/* ── BOOKING FORM → WHATSAPP ── */
const submitBtn = document.getElementById('wa-submit');
if(submitBtn) submitBtn.addEventListener('click', e => {
  e.preventDefault();
  const nameEl = document.getElementById('name');
  const serviceEl = document.getElementById('service-select');
  const extraEl = document.getElementById('extra');
  const name = (nameEl ? nameEl.value : 'a prospective client').trim();
  const service = serviceEl ? serviceEl.value : '';
  const extra = extraEl ? extraEl.value.trim() : '';
  let text = `Hello Royal Priesthood Studio! My name is ${name}. I'd like to book your *${service}* service.`;
  if (extra) text += `\n\nAdditional notes: ${extra}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
});

loadServices();