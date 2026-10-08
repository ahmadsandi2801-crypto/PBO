const I = window.VSIcons;
const svg = window.vsSvg;

const PLANS = [
  {
    id: 'residential-proxy', icon: 'home', name: 'Residential Proxy', badge: 'Most popular',
    desc: 'Real home IPs, rotating & sticky, targeting down to ZIP/ASN',
    stats: [['180,000,000+', 'Residential IPs'], ['195+', 'Countries'], ['20,000', 'Ports per generate']],
    feats: ['Rotating & sticky', 'Targeting down to ZIP & ASN', 'HTTP, HTTPS & SOCKS5', 'Generate thousands of ports'],
    price: 'Rp 6.600', amount: 6600, unit: '/GB'
  },
  {
    id: 'residential-premium', icon: 'star', name: 'Residential Premium', badge: 'Most stable',
    desc: 'Premium-grade residential: the most stable connections, targeting down to city & ASN',
    stats: [['225', 'Targetable countries'], ['38,801', 'Targetable cities'], ['20,119', 'Targetable ASNs']],
    feats: ['Stricter IP quality', 'Country, state, city & ASN', 'Sticky & rotating ports', 'Pick the nearest gateway'],
    price: 'Rp 3.600', amount: 3600, unit: '/GB'
  },
  {
    id: 'isp-rotate', icon: 'refresh', name: 'ISP Rotate', badge: '',
    desc: 'High-trust ISP IPs, unlimited IP changes, 2-digit ping',
    stats: [['Unlimited', 'IP changes'], ['2 digit', 'Stable ping (ms)'], ['3', 'Active days per order']],
    feats: ['Unlimited IP changes', 'Stable 2-digit ping', 'Multiple connections', 'IP status checks'],
    price: 'Rp 3.000', amount: 3000, unit: '/order'
  },
  {
    id: 'static-datacenter', icon: 'server', name: 'Static Datacenter', badge: 'Lowest starting price',
    desc: 'All-green static IPs, custom active days, IP replacement warranty',
    stats: [['100%', 'Checked before delivery'], ['Custom', 'Active days'], ['SOCKS5', '& HTTP']],
    feats: ['All green on delivery', 'Custom active days', 'Replacement allowance', 'Custom warranty'],
    price: 'Rp 300', amount: 300, unit: '/IP'
  },
  {
    id: 'datacenter-gb', icon: 'db', name: 'Datacenter per GB', badge: '',
    desc: 'Pay-per-GB datacenter, 15,000 ports, TCP/UDP',
    stats: [['15,000', 'Ports per generate'], ['10,000', 'Threads'], ['180+', 'Countries']],
    feats: ['Pay per GB', '15,000 ports', 'TCP & UDP', 'Many subnets'],
    price: 'Rp 6.000', amount: 6000, unit: '/GB'
  },
  {
    id: 'rdp-vps', icon: 'monitor', name: 'RDP / Windows VPS', badge: '',
    desc: 'Windows Server with full admin access, unlimited bandwidth',
    stats: [['10 Gbps', 'Network port'], ['NVMe', 'SSD storage'], ['Admin', 'Full access']],
    feats: ['Windows Server', 'Administrator access', 'Public IPv4', 'Low latency'],
    price: 'Rp 150.000', amount: 150000, unit: '/server'
  }
];

const plansEl = document.getElementById('plans');

plansEl.innerHTML = PLANS.map(p => `
  <article class="card p-7 flex flex-col">
    <div class="flex items-start gap-4">
      <span class="ico w-[52px] h-[52px]">${svg(I[p.icon], 22)}</span>
      <div>
        <div class="flex flex-wrap items-center gap-2.5">
          <h3 class="disp font-bold text-2xl">${p.name}</h3>
          ${p.badge ? `<span class="text-xs font-semibold rounded-full px-2.5 py-1" style="background:#12285e;color:#3b82ff">${p.badge}</span>` : ''}
        </div>
        <p class="mt-1.5 text-[15px]" style="color:#6f86c0">${p.desc}</p>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-3 gap-3">
      ${p.stats.map(([v, l]) => `
        <div class="rounded-xl px-2 py-3.5 text-center" style="background:#111d40;border:1px solid var(--line)">
          <div class="disp font-bold text-base sm:text-lg" style="color:#2f6bff">${v}</div>
          <div class="text-[11px] mt-0.5" style="color:var(--mut)">${l}</div>
        </div>`).join('')}
    </div>

    <ul class="mt-5 space-y-3 mb-2">
      ${p.feats.map(f => `
        <li class="flex items-center gap-3 text-[15px]">
          <span class="grid place-items-center w-5 h-5 rounded-full shrink-0" style="background:#0f2c47;color:#3aa8e0">${svg(I.check, 12)}</span>${f}
        </li>`).join('')}
    </ul>

    <div class="mt-auto pt-8">
      <div class="border-t pt-5 flex items-center justify-between gap-3 flex-wrap" style="border-color:var(--line)">
        <div class="text-sm" style="color:var(--mut)">from <span class="disp font-bold text-xl" style="color:#2f6bff">${p.price}</span> ${p.unit}</div>
        <div class="flex items-center gap-3">
          <a href="#" class="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors hover:bg-white/5" style="border:1px solid var(--line);background:#0a1127">Learn more ${svg(I.arrow, 14)}</a>
          <button type="button" data-buy="${p.id}" class="btn rounded-xl px-4 py-2.5 text-sm" style="box-shadow:0 6px 20px #2f6bff55">${svg(I.tag, 14)}Buy</button>
        </div>
      </div>
    </div>
  </article>`).join('');

plansEl.addEventListener('click', e => {
  const b = e.target.closest('[data-buy]');
  if (!b) return;
  const p = PLANS.find(x => x.id === b.dataset.buy);
  if (!p) return;
  window.VSCart.add({ id: p.id, name: p.name, icon: p.icon, price: p.amount, unit: p.unit });
});