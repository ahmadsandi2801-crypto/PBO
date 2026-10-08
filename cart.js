(function () {
  const KEY = 'vsproxy_cart';
  const CHECKOUT_URL = '';

  const I = {
    home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    refresh: '<path d="M21 12a9 9 0 01-15 6.7L3 16M3 12a9 9 0 0115-6.7L21 8M3 21v-5h5M21 3v5h-5"/>',
    server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z"/><circle cx="7.5" cy="7.5" r="1"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 001.6 1.6h8.1a2 2 0 002-1.5L21.5 8H6"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>'
  };

  const svg = (path, size = 18) =>
    `<svg width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${path}</svg>`;

  const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  };
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  };

  let items = load();

  const style = document.createElement('style');
  style.textContent = '.vs-qty::-webkit-inner-spin-button,.vs-qty::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.vs-qty{-moz-appearance:textfield}';
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'cartBtn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Open cart');
  btn.className = 'relative grid place-items-center w-10 h-10 rounded-xl transition-colors hover:bg-white/5';
  btn.style.cssText = 'border:1px solid var(--line);background:#0a1127';
  btn.innerHTML = `${svg(I.cart, 20)}<span id="cartBadge" class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-bold place-items-center" style="display:none;background:linear-gradient(90deg,#2f6bff,#1fa8f0)">0</span>`;
  document.getElementById('menuBtn').parentElement.prepend(btn);

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="cartOverlay" class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <aside id="cartPanel" role="dialog" aria-modal="true" aria-label="Shopping cart" class="fixed top-0 right-0 z-[70] h-full w-full max-w-md flex flex-col translate-x-full transition-transform duration-300" style="background:linear-gradient(170deg,#0f1838,#070d22);border-left:1px solid var(--line);box-shadow:-20px 0 60px -20px rgba(47,107,255,.35)">
      <div class="flex items-center justify-between px-6 py-5 shrink-0" style="border-bottom:1px solid var(--line);padding-top:calc(1.25rem + env(safe-area-inset-top,0px))">
        <div class="flex items-center gap-3">
          <span class="ico">${svg(I.cart, 20)}</span>
          <div>
            <h2 class="disp font-bold text-xl leading-tight">Your cart</h2>
            <p id="cartCount" class="text-xs" style="color:var(--mut)">0 items</p>
          </div>
        </div>
        <button id="cartClose" type="button" aria-label="Close cart" class="p-2 rounded-lg transition-colors hover:bg-white/5" style="color:var(--mut)">${svg(I.close, 20)}</button>
      </div>

      <div id="cartBody" class="flex-1 overflow-y-auto px-6 py-5"></div>

      <div id="cartFoot" class="shrink-0 px-6 pt-5" style="border-top:1px solid var(--line);padding-bottom:calc(1.25rem + env(safe-area-inset-bottom,0px))">
        <div class="flex items-center justify-between">
          <span style="color:var(--mut)">Subtotal</span>
          <span id="cartTotal" class="disp font-bold text-2xl" style="color:#4b8bff">Rp 0</span>
        </div>
        <p class="mt-1 text-xs" style="color:var(--mut)">Final price is confirmed at checkout.</p>
        <button id="cartCheckout" type="button" class="btn w-full justify-center mt-4">${svg(I.tag, 16)}Checkout</button>
        <button id="cartClear" type="button" class="w-full mt-3 text-sm py-2 rounded-lg transition-colors hover:bg-white/5" style="color:var(--mut)">Clear cart</button>
      </div>
    </aside>`;
  document.body.appendChild(wrap);

  const overlay = document.getElementById('cartOverlay');
  const panel = document.getElementById('cartPanel');
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const badge = document.getElementById('cartBadge');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('cartCheckout');

  panel.inert = true;

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'fixed left-1/2 z-[80] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-xl';
    t.style.cssText = 'bottom:calc(24px + env(safe-area-inset-bottom,0px));background:#12285e;border:1px solid #2a4a96;color:#e8eeff;max-width:90vw';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  function open() {
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    panel.classList.remove('translate-x-full');
    panel.inert = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('cartClose').focus();
  }

  function close() {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    panel.classList.add('translate-x-full');
    panel.inert = true;
    document.body.style.overflow = '';
    btn.focus();
  }

  function render() {
    const n = items.length;
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);

    badge.textContent = n;
    badge.style.display = n ? 'grid' : 'none';
    countEl.textContent = n === 1 ? '1 item' : n + ' items';
    totalEl.textContent = rp(total);
    foot.style.display = n ? 'block' : 'none';

    if (!n) {
      body.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
          <span class="ico !w-16 !h-16 !rounded-2xl">${svg(I.cart, 28)}</span>
          <div>
            <p class="disp font-bold text-xl">Your cart is empty</p>
            <p class="mt-1 text-sm" style="color:var(--mut)">Pick a proxy plan and it will show up here.</p>
          </div>
          <a href="product.html" class="btn text-sm">Browse products ${svg(I.arrow, 14)}</a>
        </div>`;
      return;
    }

    body.innerHTML = '<ul class="space-y-3">' + items.map(it => `
      <li class="flex gap-3.5 rounded-2xl p-3.5" style="background:#0e1735;border:1px solid var(--line)">
        <span class="ico">${svg(I[it.icon] || I.tag, 20)}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="disp font-bold truncate">${it.name}</p>
              <p class="text-xs" style="color:var(--mut)">${rp(it.price)} ${it.unit}</p>
            </div>
            <button type="button" data-act="remove" data-id="${it.id}" aria-label="Remove ${it.name}" class="p-1.5 rounded-lg transition-colors hover:bg-white/5" style="color:var(--mut)">${svg(I.trash, 16)}</button>
          </div>
          <div class="mt-3 flex items-center justify-between gap-3">
            <div class="flex items-center rounded-lg overflow-hidden" style="border:1px solid var(--line);background:#0a1127">
              <button type="button" data-act="dec" data-id="${it.id}" aria-label="Decrease quantity" class="w-8 h-8 grid place-items-center transition-colors hover:bg-white/5">${svg(I.minus, 14)}</button>
              <input data-act="qty" data-id="${it.id}" type="number" min="1" value="${it.qty}" aria-label="Quantity" class="vs-qty w-14 h-8 text-center bg-transparent text-sm font-semibold outline-none">
              <button type="button" data-act="inc" data-id="${it.id}" aria-label="Increase quantity" class="w-8 h-8 grid place-items-center transition-colors hover:bg-white/5">${svg(I.plus, 14)}</button>
            </div>
            <span class="disp font-bold" style="color:#4b8bff">${rp(it.price * it.qty)}</span>
          </div>
        </div>
      </li>`).join('') + '</ul>';
  }

  function add(p) {
    const found = items.find(x => x.id === p.id);
    if (found) found.qty += 1;
    else items.push({ id: p.id, name: p.name, icon: p.icon, price: p.price, unit: p.unit, qty: 1 });
    save();
    render();
    open();
  }

  function setQty(id, q) {
    const it = items.find(x => x.id === id);
    if (!it) return;
    q = Math.floor(Number(q));
    it.qty = Math.min(Math.max(q || 1, 1), 999999);
    save();
    render();
  }

  function remove(id) {
    items = items.filter(x => x.id !== id);
    save();
    render();
  }

  body.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const it = items.find(x => x.id === el.dataset.id);
    if (!it) return;
    if (el.dataset.act === 'remove') remove(it.id);
    if (el.dataset.act === 'inc') setQty(it.id, it.qty + 1);
    if (el.dataset.act === 'dec') setQty(it.id, it.qty - 1);
  });

  body.addEventListener('change', e => {
    const el = e.target.closest('[data-act="qty"]');
    if (el) setQty(el.dataset.id, el.value);
  });

  btn.onclick = open;
  overlay.onclick = close;
  document.getElementById('cartClose').onclick = close;
  document.getElementById('cartClear').onclick = () => { items = []; save(); render(); };
  checkoutBtn.onclick = () => {
    if (!items.length) return;
    if (CHECKOUT_URL) { location.href = CHECKOUT_URL; return; }
    toast("Checkout isn't connected yet. Set CHECKOUT_URL in cart.js.");
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.inert) close();
  });

  window.addEventListener('storage', e => {
    if (e.key === KEY) { items = load(); render(); }
  });

  window.VSCart = { add, open, close };
  window.VSIcons = I;
  window.vsSvg = svg;

  render();
})();