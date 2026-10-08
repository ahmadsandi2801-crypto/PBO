const fmt = n => n.toLocaleString('en-US');

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  io.unobserve(e.target);
  const el = e.target, end = +el.dataset.n, t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}), { threshold: .5 });
document.querySelectorAll('[data-n]').forEach(el => io.observe(el));

const flagImg = code =>
  `<img src="https://flagcdn.com/w40/${code}.png" srcset="https://flagcdn.com/w80/${code}.png 2x" alt="" width="20" height="15" loading="lazy" class="w-5 h-[15px] rounded-[2px] object-cover shrink-0" onerror="this.style.visibility='hidden'">`;

const C = [
  ['us','United States'],['gb','United Kingdom'],['de','Germany'],['fr','France'],
  ['nl','Netherlands'],['sg','Singapore'],['jp','Japan'],['kr','South Korea'],
  ['id','Indonesia'],['my','Malaysia'],['th','Thailand'],['vn','Vietnam'],
  ['in','India'],['au','Australia'],['ca','Canada'],['br','Brazil'],
  ['mx','Mexico'],['es','Spain'],['it','Italy'],['pl','Poland'],
  ['tr','Türkiye'],['ae','United Arab Emirates'],['sa','Saudi Arabia'],['za','South Africa']
];

const chips = document.getElementById('chips');
C.forEach(([code, name], i) => {
  const b = document.createElement('button');
  b.className = 'chip' + (i === 0 ? ' on' : '');
  b.title = name;
  b.innerHTML = `${flagImg(code)}<span class="truncate">${name}</span>`;
  b.onclick = () => {
    chips.querySelectorAll('.on').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    gen(code);
  };
  chips.appendChild(b);
});

const flags = ['us','de','sg','id','jp'];
const portsEl = document.getElementById('ports');

function gen(first) {
  const fl = first ? [first, ...flags.slice(1)] : flags;
  portsEl.innerHTML = fl.map((code, i) => {
    const ms = [78, 112, 43, 21, 64].map(v => Math.max(8, v + Math.round((Math.random() - .5) * 20)))[i];
    return `<div class="flex items-center gap-2">${flagImg(code)}<span class="truncate"><span style="color:#cfd8f5">gb.vsproxy.org:</span><span style="color:#5ab0ff">${10001 + i}</span><span style="color:#cfd8f5">:user:····</span></span><span class="ml-auto" style="color:var(--ok)">${ms} ms</span></div>`;
  }).join('');
}
gen();
document.getElementById('regen').onclick = () => gen();

const rip = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 254) + 1).join('.');
const ipRot = document.getElementById('ipRot');
const ipSt = document.getElementById('ipSt');
setInterval(() => { ipRot.textContent = rip(); }, 1800);
setInterval(() => { ipSt.textContent = rip(); }, 9000);

(function () {
  const pts = [130,112,118,98,104,82,92,70,78,56,64,44,52,36], w = 400, h = 160;
  const xy = pts.map((y, i) => [i * (w - 20) / (pts.length - 1) + 10, y]);
  const line = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1]).join(' ');
  const last = xy[xy.length - 1];
  document.getElementById('chart').innerHTML = `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2f8bff" stop-opacity=".45"/>
      <stop offset="1" stop-color="#2f8bff" stop-opacity="0"/>
    </linearGradient></defs>
    ${[50, 90, 130].map(y => `<line x1="0" x2="${w}" y1="${y}" y2="${y}" stroke="#27468f" stroke-dasharray="2 5" opacity=".6"/>`).join('')}
    <path d="${line} L${last[0]} ${h} L10 ${h}Z" fill="url(#g)"/>
    <path d="${line}" fill="none" stroke="#2f8bff" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="4" fill="#1fa8f0"/>`;
})();

(function () {
  const cv = document.getElementById('globe'), ctx = cv.getContext('2d');
  const N = 2600, P = [];
  const ga = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < N; i++) {
    const y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y), t = ga * i;
    const x = Math.cos(t) * r, z = Math.sin(t) * r;
    const lat = Math.asin(y), lon = Math.atan2(z, x);
    const land = Math.sin(lon * 2.1 + 1) * Math.cos(lat * 3) + Math.sin(lon * 4.3) * Math.cos(lat * 2.2 + 1) > .35;
    P.push([x, y, z, land]);
  }

  let a = 2.4, size = 0, raf = 0;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  function fit() {
    const d = devicePixelRatio || 1, w = cv.clientWidth;
    cv.width = cv.height = w * d;
    size = w * d;
  }

  function draw() {
    const R = size * .38, c = size / 2;
    ctx.clearRect(0, 0, size, size);

    const g = ctx.createRadialGradient(c - R * .3, c - R * .3, R * .1, c, c, R);
    g.addColorStop(0, '#173a8a');
    g.addColorStop(1, '#071433');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.fill();

    ctx.strokeStyle = '#2a8fe0';
    ctx.lineWidth = size * .004;
    ctx.shadowColor = '#1fa8f0';
    ctx.shadowBlur = size * .03;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const ca = Math.cos(a), sa = Math.sin(a);
    for (const [x, y, z, l] of P) {
      const X = x * ca + z * sa, Z = -x * sa + z * ca;
      if (Z < 0) continue;
      ctx.fillStyle = l ? `rgba(40,170,255,${.35 + Z * .65})` : `rgba(40,90,170,${.12 + Z * .15})`;
      const s = (l ? 1.5 : .8) * size / 520;
      ctx.fillRect(c + X * R, c - y * R, s, s);
    }

    ctx.strokeStyle = '#2a8fe055';
    ctx.setLineDash([6, 8]);
    ctx.lineWidth = size * .002;
    ctx.beginPath(); ctx.ellipse(c, c, R * 1.2, R * .5, -.35, 0, 7); ctx.stroke();
    ctx.setLineDash([]);
  }

  function tick() {
    a += .0035;
    draw();
    raf = requestAnimationFrame(tick);
  }

  fit();
  draw();

  addEventListener('resize', () => { fit(); draw(); });

  if (!reduce) {
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(tick);
    }).observe(cv);
  }
})();