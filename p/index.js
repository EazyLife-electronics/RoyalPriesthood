/* ══════════════════════════════════════
   JSON LOADER
══════════════════════════════════════ */
async function j(path){ try{ const r=await fetch(path); if(!r.ok) throw 0; return r.json(); }catch{ return null; } }

async function loadData(){
  const [studio, services, gallery] = await Promise.all([
    j('studio-info.json'), j('services.json'), j('gallery.json')
  ]);

  /* ── STUDIO INFO ── */
  if(studio){
    waNumber = studio.whatsapp || '';
    const num = waNumber.replace(/\D/g,'');
    const waBase = `https://wa.me/${num}`;

    if(studio.tagline)     document.getElementById('hero-tagline').textContent    = studio.tagline;
    if(studio.description) document.getElementById('about-body').textContent      = studio.description;
    if(studio.location)    document.getElementById('footer-location').textContent = studio.location;

    document.getElementById('hero-wa-btn').href = waBase;
    document.getElementById('floatingWa').href  = waBase;

    const statsData = studio.stats || [
      {num:'500+',label:'Sessions Done'},{num:'200+',label:'Happy Clients'},
      {num:'50+', label:'Events Covered'},{num:'100%',label:'Satisfaction Rate'}
    ];
    document.getElementById('about-stats').innerHTML = statsData.map(s=>\`
      <div class="stat-card reveal">
        <div class="stat-num">\${s.num}</div>
        <div class="stat-label">\${s.label}</div>
      </div>\`).join('');

    document.getElementById('contact-details').innerHTML = \`
      \${studio.location?\`<div class="contact-item">
        <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
        <div><div class="contact-item-label">Location</div><div class="contact-item-value">\${studio.location}</div></div>
      </div>\`:''}
      <div class="contact-item">
        <div class="contact-icon"><i class="fab fa-whatsapp"></i></div>
        <div><div class="contact-item-label">WhatsApp</div>
          <div class="contact-item-value"><a href="\${waBase}" target="_blank">\${studio.whatsapp}</a></div>
        </div>
      </div>
      \${studio.email?\`<div class="contact-item">
        <div class="contact-icon"><i class="fas fa-envelope"></i></div>
        <div><div class="contact-item-label">Email</div>
          <div class="contact-item-value"><a href="mailto:\${studio.email}">\${studio.email}</a></div>
        </div>
      </div>\`:''}
      \${studio.instagram?\`<div class="contact-item">
        <div class="contact-icon"><i class="fab fa-instagram"></i></div>
        <div><div class="contact-item-label">Instagram</div><div class="contact-item-value">\${studio.instagram}</div></div>
      </div>\`:''}\`;
    buildWaLink();
  }

  /* ── SERVICES ── */
  if(services && services.length){
    const SERVICES_LIMIT = 4;
    const grid = document.getElementById('services-grid');
    const sel  = document.getElementById('cf-service');
    const num  = waNumber.replace(/\D/g,'');

    services.forEach(s => {
      const o = document.createElement('option');
      o.value = s.title; o.textContent = s.title; sel.appendChild(o);
    });

    const pickedIndices = sessionPick('rps-services-indices', services.length, SERVICES_LIMIT);
    const preview = pickedIndices.map(i => services[i]);

    grid.innerHTML = preview.map((s,i) => {
      const n = String(i+1).padStart(2,'0');
      let mediaHTML = '';
      if(s.video)       mediaHTML = \`<div class="service-media-wrap visible"><iframe src="\${s.video}" allowfullscreen loading="lazy"></iframe></div>\`;
      else if(s.image)  mediaHTML = \`<div class="service-media-wrap visible"><img src="\${s.image}" alt="\${s.title}" loading="lazy"/></div>\`;
      const msg = encodeURIComponent(s.message || \`Hello, I'd like to book: \${s.title}\`);
      return \`<div class="service-card reveal reveal-delay-\${(i%3)+1}">
        \${mediaHTML}
        <div class="service-num">\${n}</div>
        <div class="service-icon-wrap">\${s.icon||'📸'}</div>
        <div class="service-name">\${s.title}</div>
        <p class="service-desc">\${s.desc}</p>
        \${s.price?\`<div class="service-price">\${s.price}</div>\`:''}
        <a class="btn-wa-service" href="https://wa.me/\${num}?text=\${msg}" target="_blank">
          <i class="fab fa-whatsapp"></i>&nbsp; Book This Service
        </a>
      </div>\`;
    }).join('');

    if(services.length > SERVICES_LIMIT){
      const ctaEl = document.getElementById('services-cta');
      if(ctaEl) ctaEl.style.display = 'flex';
    }
  }

  /* ── GALLERY ── */
  if(gallery && gallery.length){
    const GALLERY_LIMIT = 4;
    const pickedIndices = sessionPick('rps-gallery-indices', gallery.length, GALLERY_LIMIT);
    const preview = pickedIndices.map(i => gallery[i]);
    document.getElementById('gallery-grid').innerHTML = preview.map((item, idx) => buildSlider(item, idx)).join('');
  }

  watchAll();
}

loadData();