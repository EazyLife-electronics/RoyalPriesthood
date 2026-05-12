/* ══════════════════════════════════════
   THEME
══════════════════════════════════════ */
const themeToggle       = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const htmlEl            = document.documentElement;
const themeIcon         = themeToggle ? themeToggle.querySelector('i') : null;

function setTheme(t) {
  htmlEl.setAttribute('data-theme', t);
  localStorage.setItem('rps-theme', t);
  if(themeIcon) themeIcon.className = (t === 'light') ? 'fas fa-sun' : 'fas fa-moon';
}
function toggleTheme() {
  const cur = htmlEl.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(cur === 'light' ? 'dark' : 'light');
}
const saved = localStorage.getItem('rps-theme');
if (saved) { setTheme(saved); }
else if(themeIcon) { themeIcon.className = window.matchMedia('(prefers-color-scheme:light)').matches ? 'fas fa-sun' : 'fas fa-moon'; }

if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
if(mobileThemeToggle) mobileThemeToggle.addEventListener('click', e => { e.preventDefault(); toggleTheme(); closeMobile(); });

/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
const cursor = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
if(cursor && ring){
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
  (function tick(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick);})();
  document.addEventListener('mouseover', e => {
    const over = e.target.closest('a,button,.service-card,.gallery-item');
    if(cursor) cursor.classList.toggle('expand',!!over);
    if(ring) ring.classList.toggle('expand',!!over);
  });
}

/* ══════════════════════════════════════
   NAV / MOBILE
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
if(navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 60));
function toggleMobile(){ const m = document.getElementById('mobileMenu'); if(m) m.classList.toggle('open'); }
function closeMobile() { const m = document.getElementById('mobileMenu'); if(m) m.classList.remove('open'); }

/* ══════════════════════════════════════
   REVEAL
══════════════════════════════════════ */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
}),{threshold:.1});
function watchAll(){ document.querySelectorAll('.reveal').forEach(el => io.observe(el)); }
watchAll();

/* ══════════════════════════════════════
   WHATSAPP FORM
══════════════════════════════════════ */
let waNumber = '';
function buildWaLink(){
  const fname   = document.getElementById('cf-fname');
  const lname   = document.getElementById('cf-lname');
  const phone   = document.getElementById('cf-phone');
  const service = document.getElementById('cf-service');
  const msg     = document.getElementById('cf-message');
  if(!fname || !lname || !phone || !service || !msg) return;
  const f = fname.value.trim(), l = lname.value.trim(), p = phone.value.trim(), s = service.value, m = msg.value.trim();
  const name = [f,l].filter(Boolean).join(' ') || 'A client';
  let text = `Hello Royal Priesthood Studio! 👋\n\nMy name is *${name}*.`;
  if(p) text += `\n📞 Phone: ${p}`;
  if(s) text += `\n📷 Service: ${s}`;
  if(m) text += `\n\n💬 ${m}`;
  const num = waNumber.replace(/\D/g,'');
  const btn = document.getElementById('btn-wa-contact');
  if(btn) btn.href = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
['cf-fname','cf-lname','cf-phone','cf-service','cf-message'].forEach(id => {
  const el = document.getElementById(id); if(el) el.addEventListener('input', buildWaLink);
});

/* ══════════════════════════════════════
   SESSION-RANDOM PICKER
══════════════════════════════════════ */
function sessionPick(key, totalCount, pickCount) {
  const stored = sessionStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch(e) {}
  }
  const indices = Array.from({length: totalCount}, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const picked = indices.slice(0, Math.min(pickCount, totalCount));
  sessionStorage.setItem(key, JSON.stringify(picked));
  return picked;
}

/* ══════════════════════════════════════
   GALLERY SLIDER
══════════════════════════════════════ */
function buildSlider(item, idx){
  const media  = item.media || (item.url ? [item.url] : []);
  const isMulti = media.length > 1;

  const mediaHTML = media.map(url => {
    if(url.includes('youtube.com') || url.includes('youtu.be') || url.includes('embed')) {
      const src = url.includes('?') ? url : url + '?rel=0';
      return `<iframe src="${src}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
    }
    return `<img src="${url}" alt="${item.title || ''}" loading="lazy"/>`;
  }).join('');

  const dotsHTML = isMulti
    ? `<div class="slider-dots">${media.map((_,i) =>
        `<span class="dot ${i===0?'active':''}" onclick="moveTo(${idx},${i})"></span>`
      ).join('')}</div>`
    : '';

  const navHTML = isMulti
    ? `<button class="slider-nav prev-btn" onclick="moveSlider(${idx},-1)"><i class="fas fa-chevron-left"></i></button>
       <button class="slider-nav next-btn" onclick="moveSlider(${idx}, 1)"><i class="fas fa-chevron-right"></i></button>`
    : '';

  const counterHTML = isMulti
    ? `<div class="slide-counter" id="counter-${idx}">1 / ${media.length}</div>`
    : '';

  return `
    <div class="gallery-item reveal" id="gal-${idx}" data-current="0" data-total="${media.length}">
      <div class="gallery-media-wrap"
           ontouchstart="touchStart(event,${idx})"
           ontouchmove="touchMove(event,${idx})"
           ontouchend="touchEnd(event,${idx})">
        ${navHTML}
        ${counterHTML}
        <div class="slider-container" id="slide-cont-${idx}">${mediaHTML}</div>
        ${dotsHTML}
      </div>
      <div class="gallery-item-body">
        ${item.date ? `<div class="gallery-item-date">${item.date}</div>` : ''}
        <div class="gallery-item-title">${item.title || ''}</div>
        <p class="gallery-item-desc">${item.desc || ''}</p>
      </div>
    </div>`;
}

window.moveTo = function(idx, pos){
  const el   = document.getElementById(`gal-${idx}`);
  const cont = document.getElementById(`slide-cont-${idx}`);
  if(!el || !cont) return;
  const total = parseInt(el.dataset.total);
  pos = Math.max(0, Math.min(pos, total-1));
  el.dataset.current = pos;
  cont.style.transform = `translateX(-${pos * 100}%)`;
  el.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i===pos));
  const counter = document.getElementById(`counter-${idx}`);
  if(counter) counter.textContent = `${pos+1} / ${total}`;
};

window.moveSlider = function(idx, dir){
  const el    = document.getElementById(`gal-${idx}`);
  if(!el) return;
  const total = parseInt(el.dataset.total);
  const cur   = parseInt(el.dataset.current);
  moveTo(idx, (cur + dir + total) % total);
};

let _tx = {}, _ty = {};
window.touchStart = function(e, idx){ _tx[idx]=e.changedTouches[0].screenX; _ty[idx]=e.changedTouches[0].screenY; };
window.touchMove  = function(e, idx){
  const dx = Math.abs(e.changedTouches[0].screenX - _tx[idx]);
  const dy = Math.abs(e.changedTouches[0].screenY - _ty[idx]);
  if(dx > dy) e.preventDefault();
};
window.touchEnd   = function(e, idx){
  const dx = e.changedTouches[0].screenX - _tx[idx];
  if(Math.abs(dx) > 48) moveSlider(idx, dx < 0 ? 1 : -1);
};