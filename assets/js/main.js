document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a.eml').forEach(function (a) {
    var addr = a.getAttribute('data-u') + String.fromCharCode(64) + a.getAttribute('data-d');
    a.setAttribute('href', 'mail' + 'to:' + addr);
    a.textContent = addr;
  });

  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () { mobileNav.classList.toggle('open'); });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
  }

  var lb = document.getElementById('lightbox');
  if (lb) {
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.gallery-tile'));
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCaption');
    var lbCount = document.getElementById('lbCount');
    var cur = 0;
    function render() {
      var t = tiles[cur];
      lbImg.src = t.getAttribute('data-src');
      lbImg.alt = t.getAttribute('data-caption') || '';
      lbCap.textContent = t.getAttribute('data-caption') || '';
      lbCount.textContent = (cur + 1) + ' / ' + tiles.length;
    }
    function open(i) { cur = i; render(); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
    function step(d) { cur = (cur + d + tiles.length) % tiles.length; render(); }
    tiles.forEach(function (t, i) { t.addEventListener('click', function () { open(i); }); });
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  var mapEl = document.getElementById('serviceMap');
  if (mapEl && window.L) {
    var areas = [
      { n: 'Dade City', lat: 28.3647, lng: -82.1959, d: 'top', o: [0, -28] },
      { n: 'Zephyrhills', lat: 28.2336, lng: -82.1812, d: 'right', o: [8, -12] },
      { n: 'San Antonio / St. Leo', lat: 28.3358, lng: -82.2751, d: 'left', o: [-10, -12] }
    ];
    var map = L.map('serviceMap', { scrollWheelZoom: false }).setView([28.30, -82.22], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors', maxZoom: 18
    }).addTo(map);
    var pin = L.divIcon({
      className: '',
      html: '<svg width="26" height="26" viewBox="0 0 24 24" fill="#3949ab" stroke="#ffffff" stroke-width="1.5"><path d="M12 22s7-6.2 7-11.3A7 7 0 0 0 5 10.7C5 15.8 12 22 12 22z"/><circle cx="12" cy="10.5" r="2.6" fill="#ffffff" stroke="none"/></svg>',
      iconSize: [26, 26], iconAnchor: [13, 26]
    });
    var group = [];
    areas.forEach(function (a) {
      var m = L.marker([a.lat, a.lng], { icon: pin }).addTo(map)
        .bindTooltip(a.n, { permanent: true, direction: a.d, offset: a.o, className: 'area-label' });
      group.push(m);
    });
    map.fitBounds(L.featureGroup(group).getBounds(), { padding: [60, 60], maxZoom: 11 });
    setTimeout(function () {
      map.invalidateSize();
      map.fitBounds(L.featureGroup(group).getBounds(), { padding: [60, 60], maxZoom: 11 });
    }, 300);
  }

  var carousel = document.getElementById('heroCarousel');
  if (!carousel) return;
  var items = carousel.querySelectorAll('.hero-carousel-item');
  var idx = 0;
  setInterval(function () {
    idx = (idx + 1) % items.length;
    items.forEach(function (item, i) {
      item.classList.toggle('active', i === idx);
    });
  }, 5000);
});