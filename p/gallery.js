/* ── CONFIG: replace with your real WhatsApp number ── */
const WA_NUMBER = '234XXXXXXXXXX';

/* ── LOAD GALLERY FROM gallery.json ── */
async function loadGallery() {
  try {
    const r = await fetch('gallery.json');
    const gallery = await r.json();
    const grid = document.getElementById('gallery-grid');

    grid.innerHTML = gallery.map((item, idx) => {
      const isMulti = item.media.length > 1;
      const mediaHTML = item.media.map(url => {
        if(url.includes('youtube.com') || url.includes('embed')) return `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`;
        return `<img src="${url}" alt="${item.title}">`;
      }).join('');

      const dotsHTML = isMulti ? `<div class="slider-dots">${item.media.map((_, i) => `<div class="dot ${i===0?'active':''}" onclick="moveTo(${idx},${i})"></div>`).join('')}</div>` : '';
      const navHTML = isMulti ? `<button class="slider-nav prev-btn" onclick="moveSlider(${idx},-1)"><i class="fas fa-chevron-left"></i></button><button class="slider-nav next-btn" onclick="moveSlider(${idx},1)"><i class="fas fa-chevron-right"></i></button>` : '';

      return `<div class="gallery-item reveal" id="gal-${idx}" data-current="0" data-total="${item.media.length}">
                <div class="gallery-media-wrap" ontouchstart="touchStart(event,${idx})" ontouchend="touchEnd(event,${idx})">
                  ${navHTML}<div class="slider-container" id="slide-cont-${idx}">${mediaHTML}</div>${dotsHTML}
                </div>
                <div class="gallery-item-body"><h3 class="gallery-item-title">${item.title}</h3><p class="gallery-item-desc">${item.desc}</p></div>
              </div>`;
    }).join('');

    watchAll();
  } catch (e) { console.error(e); }
}

/* ── WHATSAPP FORM ── */
function buildWa() {
  const name = document.getElementById('cf-name').value, srv = document.getElementById('cf-service').value, msg = document.getElementById('cf-message').value;
  const text = `Hello Royal Priesthood! I'm ${name}. I'm interested in ${srv}. ${msg}`;
  document.getElementById('btn-wa-contact').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`; // Replace X with your number
}
document.querySelectorAll('.form-control').forEach(el => el.addEventListener('input', buildWa));

loadGallery();