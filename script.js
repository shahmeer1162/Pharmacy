/* ============================================
   Barkat Pharmacy — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 800);
  });
  setTimeout(() => preloader.classList.add('loaded'), 2500);

  // --- Particles ---
  const particlesContainer = document.getElementById('particles');
  function createParticles() {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 8 + 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.background = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][Math.floor(Math.random() * 4)];
      p.style.animationDuration = (Math.random() * 20 + 15) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      particlesContainer.appendChild(p);
    }
  }
  createParticles();

  // --- Navbar Scroll ---
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 600);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Mobile Nav ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  let overlay = document.createElement('div');
  overlay.classList.add('mobile-nav-overlay');
  document.body.appendChild(overlay);

  function toggleMobileNav(open) {
    mobileNav.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    hamburger.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMobileNav(true));
  mobileNavClose.addEventListener('click', () => toggleMobileNav(false));
  overlay.addEventListener('click', () => toggleMobileNav(false));

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  // --- Product Catalog (mirror of server /api/products) ---
  const PRODUCT_ICONS = {
    prescription: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    wellness: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M12 6v6M9 10h6"/></svg>',
    personal: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    devices: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    immunity: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
  };

  // Products are loaded from the server /api/products (single source of truth).
  // To add/update products, edit netlify/functions/_shared/core.js and redeploy.
  // The list below is only a fallback if the API is unreachable.
  let CATALOG = [
    { name: 'Panadol Extra (24 Tablets)', cat: 'wellness', catLabel: 'Wellness', price: 3500 },
    { name: 'Cetirizine Allergy Relief', cat: 'personal', catLabel: 'Personal Care', price: 6999 },
    { name: 'Glucose Monitoring Kit', cat: 'devices', catLabel: 'Devices', price: 12500 },
    { name: 'Honey & Lemon Cough Syrup', cat: 'immunity', catLabel: 'Immunity', price: 5100 },
    { name: 'Amoxil (Amoxicillin 500mg)', cat: 'prescription', catLabel: 'Prescription', price: 850 },
    { name: 'Dettol Liquid Antiseptic 250ml', cat: 'personal', catLabel: 'Personal Care', price: 320 },
    { name: 'Multivitamin Gummies Daily', cat: 'wellness', catLabel: 'Wellness', price: 2450 },
    { name: 'Digital Thermometer (Non-Contact)', cat: 'devices', catLabel: 'Devices', price: 2800 },
    { name: 'Panadol Original (20 Tablets)', cat: 'prescription', catLabel: 'Prescription', price: 290 },
    { name: 'Vitamin C 1000mg Effervescent', cat: 'wellness', catLabel: 'Wellness', price: 1450 },
    { name: 'Fluconazole 150mg', cat: 'prescription', catLabel: 'Prescription', price: 390 },
    { name: 'Omeprazole 20mg', cat: 'prescription', catLabel: 'Prescription', price: 440 },
    { name: 'Dispirin 325mg', cat: 'prescription', catLabel: 'Prescription', price: 180 },
    { name: 'Calpol Syrup 100ml', cat: 'wellness', catLabel: 'Wellness', price: 260 },
    { name: 'Brufen 400mg (20 Tablets)', cat: 'prescription', catLabel: 'Prescription', price: 620 },
    { name: 'Sensodyne Toothpaste', cat: 'personal', catLabel: 'Personal Care', price: 950 },
    { name: 'Dettol Handwash Pump 500ml', cat: 'personal', catLabel: 'Personal Care', price: 540 },
    { name: 'Digital BP Monitor Upper Arm', cat: 'devices', catLabel: 'Devices', price: 8900 },
    { name: 'Omega-3 Fish Oil Capsules', cat: 'wellness', catLabel: 'Wellness', price: 3100 },
    { name: 'Face Mask Surgical (50 Pack)', cat: 'personal', catLabel: 'Personal Care', price: 750 }
  ];

  /* ---------- Product Grid (rendered from catalog) ---------- */

  function bigProductIcon(svg) {
    return svg
      .replace(/width="22"/, 'width="64"')
      .replace(/height="22"/, 'height="64"')
      .replace(/stroke-width="1\.8"/, 'stroke-width="1"')
      .replace('>', ' opacity="0.3">');
  }

  function renderProductGrid() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const wishlistSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
    const starFull = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    const starDim = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    grid.innerHTML = CATALOG.map((p, i) => {
      const icon = PRODUCT_ICONS[p.cat] || PRODUCT_ICONS.wellness;
      const reviewCount = 40 + ((p.id || i + 1) * 37) % 260;
      return `
        <div class="product-card animated" data-delay="${i % 4}" data-category="${p.cat}" data-name="${p.name}" data-price="${p.price}" data-catlabel="${p.catLabel}">
          <button class="product-wishlist" aria-label="Add to wishlist">${wishlistSvg}</button>
          <div class="product-image">
            <div class="product-placeholder">${bigProductIcon(icon)}</div>
          </div>
          <div class="product-info">
            <div class="product-category">${p.catLabel}</div>
            <h3 class="product-name">${p.name}</h3>
            <div class="product-rating">
              <div class="stars">${starFull.repeat(4)}${starDim}</div>
              <span class="review-count">(${reviewCount})</span>
            </div>
            <div class="product-price">
              <span class="price-current">${formatRs(p.price)}</span>
            </div>
            <button class="btn btn-primary btn-sm btn-full add-to-cart">Add to Cart</button>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.product-wishlist').forEach(btn => {
      btn.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    });
    grid.querySelectorAll('.product-card').forEach(card => renderProductCardAction(card));
  }

  async function loadProducts() {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      const list = json && json.data;
      if (json && json.success && Array.isArray(list) && list.length) {
        CATALOG = list;
      }
    } catch (err) {
      // Keep the embedded catalog as a fallback.
    }
    renderProductGrid();
  }

  // --- Cart State ---
  const cart = {};
  let activePromo = '';
  const PROMO_CODE = 'BARKAT20';
  const FREE_DELIVERY_THRESHOLD = 5000;
  const DELIVERY_FEE = 150;

  const cartBadge = document.querySelector('.cart-badge');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooterEl = document.getElementById('cartFooter');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDeliveryEl = document.getElementById('cartDelivery');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartPromoInput = document.getElementById('cartPromoInput');
  const cartPromoBtn = document.getElementById('cartPromoBtn');
  const cartPromoMsg = document.getElementById('cartPromoMsg');

  function formatRs(amount) {
    return 'Rs. ' + Number(amount).toLocaleString('en-PK');
  }

  function getCartCount() {
    return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  }

  function calcTotals() {
    let subtotal = 0;
    Object.keys(cart).forEach(k => { subtotal += cart[k].price * cart[k].qty; });
    const discount = activePromo === PROMO_CODE ? Math.round(subtotal * 0.20) : 0;
    const delivery = subtotal - discount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal - discount + delivery;
    return { subtotal, discount, delivery, total };
  }

  function cartItemsArray() {
    return Object.keys(cart).map(name => ({
      name,
      price: cart[name].price,
      qty: cart[name].qty,
      cat: cart[name].cat,
      catLabel: cart[name].catLabel
    }));
  }

  /* ---------- Cart Operations ---------- */

  function updateCartBadge(pulse) {
    cartBadge.textContent = getCartCount();
    if (pulse) {
      cartBadge.style.transform = 'scale(1.3)';
      setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);
    }
  }

  function addToCart(name, price, cat, catLabel, opts) {
    opts = opts || {};
    if (cart[name]) {
      cart[name].qty++;
    } else {
      cart[name] = { price: price, qty: 1, cat: cat, catLabel: catLabel };
    }
    updateCartBadge(true);
    renderCart();
    refreshAllProductActions();
    if (!opts.silent) showToast(name + ' added to cart');
  }

  function changeQty(name, delta, opts) {
    opts = opts || {};
    if (!cart[name]) return;
    cart[name].qty += delta;
    if (cart[name].qty <= 0) delete cart[name];
    updateCartBadge(true);
    renderCart();
    refreshAllProductActions();
    if (!opts.silent && !cart[name]) showToast('Removed from cart');
  }

  function removeFromCart(name) {
    delete cart[name];
    updateCartBadge();
    renderCart();
    refreshAllProductActions();
  }

  function clearCart() {
    Object.keys(cart).forEach(k => delete cart[k]);
    activePromo = '';
    cartPromoInput.value = '';
    cartPromoInput.disabled = false;
    cartPromoBtn.textContent = 'Apply';
    setPromoMsg('', '');
    updateCartBadge();
    renderCart();
    refreshAllProductActions();
  }

  /* ---------- Rendering: Cart Drawer ---------- */

  function renderCart() {
    const keys = Object.keys(cart);

    if (keys.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <p>Your cart is empty</p>
          <span>Add some medicines to get started</span>
          <button class="btn btn-primary btn-sm" id="cartContinue">Continue Shopping</button>
        </div>`;
      document.getElementById('cartContinue').addEventListener('click', () => toggleCart(false));
      cartFooterEl.style.display = 'none';
      return;
    }

    cartFooterEl.style.display = 'block';

    let itemsHtml = '';
    keys.forEach(name => {
      const item = cart[name];
      const icon = PRODUCT_ICONS[item.cat] || PRODUCT_ICONS.wellness;
      itemsHtml += `
        <div class="cart-item">
          <div class="cart-item-icon">${icon}</div>
          <div class="cart-item-details">
            <div class="cart-item-name" title="${name}">${name}</div>
            <div class="cart-item-price">${formatRs(item.price)}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" data-action="minus" data-name="${name}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="plus" data-name="${name}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-name="${name}" aria-label="Remove ${name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
          </button>
        </div>`;
    });

    cartItemsEl.innerHTML = itemsHtml;

    const totals = calcTotals();

    cartSubtotalEl.textContent = formatRs(totals.subtotal);
    cartDeliveryEl.textContent = totals.delivery === 0 ? 'Free' : formatRs(totals.delivery);
    cartDiscountRow.style.display = totals.discount > 0 ? 'flex' : 'none';
    cartDiscountEl.textContent = '- ' + formatRs(totals.discount);
    cartTotalEl.textContent = formatRs(totals.total);

    cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        changeQty(name, btn.dataset.action === 'plus' ? 1 : -1);
      });
    });

    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.name);
        showToast('Removed from cart');
      });
    });

    if (searchResults) refreshSearchResultActions();
  }

  function setPromoMsg(text, type) {
    cartPromoMsg.textContent = text;
    cartPromoMsg.className = 'cart-promo-msg' + (type ? ' ' + type : '');
  }

  function refreshSearchResultActions() {
    searchResults.querySelectorAll('.search-result-add').forEach(btn => renderSearchResultAction(btn));
  }

  function initPromo() {
    cartPromoBtn.addEventListener('click', () => {
      if (activePromo === PROMO_CODE) {
        activePromo = '';
        cartPromoInput.value = '';
        cartPromoInput.disabled = false;
        cartPromoBtn.textContent = 'Apply';
        setPromoMsg('Promo removed', '');
        renderCart();
        return;
      }
      const code = cartPromoInput.value.trim().toUpperCase();
      if (!code) {
        setPromoMsg('Please enter a promo code', 'error');
        return;
      }
      if (code === PROMO_CODE) {
        activePromo = PROMO_CODE;
        cartPromoInput.value = PROMO_CODE;
        cartPromoInput.disabled = true;
        cartPromoBtn.textContent = 'Remove';
        setPromoMsg('20% discount applied!', 'success');
        renderCart();
        showToast('Promo code applied');
      } else {
        setPromoMsg('Invalid promo code: ' + code, 'error');
      }
    });

    cartPromoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') cartPromoBtn.click();
    });
  }

  /* ---------- Rendering: Product Card Quantity Steppers ---------- */

  function renderProductCardAction(card) {
    const name = card.dataset.name;
    if (!name) return;
    const current = card.querySelector('.add-to-cart, .qty-stepper');
    if (!current) return;

    if (cart[name]) {
      if (current.classList.contains('qty-stepper')) {
        current.querySelector('.stepper-qty').textContent = cart[name].qty;
      } else {
        const stepper = document.createElement('div');
        stepper.className = 'qty-stepper';
        stepper.innerHTML = `
          <button class="qty-btn" type="button" data-act="dec" title="Decrease quantity">−</button>
          <span class="stepper-qty">${cart[name].qty}</span>
          <button class="qty-btn" type="button" data-act="inc" title="Increase quantity">+</button>`;
        current.replaceWith(stepper);
      }
    } else {
      if (current.classList.contains('qty-stepper')) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary btn-sm btn-full add-to-cart';
        btn.type = 'button';
        btn.textContent = 'Add to Cart';
        current.replaceWith(btn);
      }
    }
  }

  function refreshAllProductActions() {
    document.querySelectorAll('.product-card').forEach(card => renderProductCardAction(card));
  }

  /* ---------- Product Card Click Handling (delegation) ---------- */

  function handleCardAdd(card) {
    const name = card.dataset.name;
    if (!name) return;
    const price = parseInt(card.dataset.price) || 0;
    addToCart(name, price, card.dataset.category || 'wellness', card.dataset.catlabel || 'Wellness');
  }

  document.querySelector('.products-grid').addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn) {
      const card = addBtn.closest('.product-card');
      if (card) handleCardAdd(card);
      return;
    }
    const qtyBtn = e.target.closest('.qty-stepper .qty-btn');
    if (qtyBtn) {
      const card = qtyBtn.closest('.product-card');
      if (!card) return;
      const name = card.dataset.name;
      if (qtyBtn.dataset.act === 'inc') {
        addToCart(name, cart[name].price, cart[name].cat, cart[name].catLabel, { silent: true });
      } else {
        changeQty(name, -1, { silent: true });
      }
    }
  });

  /* ---------- Wishlist Toggle ---------- */
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', function () {
      this.classList.toggle('active');
    });
  });

  /* ---------- Toast ---------- */
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.classList.add('toast');
      toast.innerHTML = `
        <div class="toast-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span></span>
      `;
      document.body.appendChild(toast);
    }
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Cart Drawer Open/Close ---------- */

  function toggleCart(open) {
    const willOpen = open !== undefined ? open : !cartDrawer.classList.contains('open');
    cartDrawer.classList.toggle('open', willOpen);
    cartOverlay.classList.toggle('active', willOpen);
    cartDrawer.setAttribute('aria-hidden', !willOpen);
    document.body.style.overflow = willOpen ? 'hidden' : '';
    if (willOpen) renderCart();
  }

  document.querySelector('.cart-btn').addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    toggleCart(true);
  });
  document.getElementById('cartClose').addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));

  /* ---------- Search ---------- */
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchSuggestions = document.getElementById('searchSuggestions');

  function renderSearchResultAction(btn) {
    const name = btn.dataset.name;
    if (cart[name]) {
      btn.className = 'search-result-add mode-stepper';
      btn.innerHTML = `
        <button class="mini-qty-btn" type="button" data-act="dec" title="Decrease">−</button>
        <span>${cart[name].qty}</span>
        <button class="mini-qty-btn" type="button" data-act="inc" title="Increase">+</button>`;
    } else {
      btn.className = 'search-result-add';
      btn.textContent = 'Add to Cart';
    }
  }

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.classList.remove('visible');
      searchResults.innerHTML = '';
      searchSuggestions.style.display = '';
      return;
    }

    const matches = CATALOG.filter(product => {
      return product.name.toLowerCase().includes(q) ||
             product.catLabel.toLowerCase().includes(q);
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h4>No medicines found</h4>
          <p>Try searching for "Panadol", "Vitamin", or "Cough"</p>
        </div>`;
      searchResults.classList.add('visible');
      searchSuggestions.style.display = 'none';
      return;
    }

    let html = '';
    matches.forEach(product => {
      const icon = PRODUCT_ICONS[product.cat] || PRODUCT_ICONS.wellness;
      html += `
        <div class="search-result-item" data-name="${product.name}">
          <div class="search-result-info">
            <div class="search-result-icon">${icon}</div>
            <div>
              <div class="search-result-name">${product.name}</div>
              <div class="search-result-cat">${product.catLabel}</div>
            </div>
          </div>
          <span class="search-result-price">${formatRs(product.price)}</span>
          <button class="search-result-add" type="button" data-name="${product.name}">Add to Cart</button>
        </div>`;
    });

    searchResults.innerHTML = html;
    searchResults.classList.add('visible');
    searchSuggestions.style.display = 'none';

    searchResults.querySelectorAll('.search-result-add').forEach(btn => renderSearchResultAction(btn));
  }

  // Delegated clicks inside search results (add + stepper + navigate)
  searchResults.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.search-result-add:not(.mode-stepper)');
    if (addBtn) {
      const product = CATALOG.find(p => p.name === addBtn.dataset.name);
      if (product) addToCart(product.name, product.price, product.cat, product.catLabel);
      return;
    }
    const miniBtn = e.target.closest('.mini-qty-btn');
    if (miniBtn) {
      const wrap = miniBtn.closest('.search-result-add');
      const product = CATALOG.find(p => p.name === wrap.dataset.name);
      if (!product) return;
      if (miniBtn.dataset.act === 'inc') {
        addToCart(product.name, product.price, product.cat, product.catLabel, { silent: true });
      } else {
        changeQty(product.name, -1, { silent: true });
      }
      return;
    }
    const info = e.target.closest('.search-result-info');
    if (info) {
      const name = info.closest('.search-result-item').dataset.name;
      navigateToProduct(name);
    }
  });

  function navigateToProduct(name) {
    const productCard = document.querySelector(`.product-card[data-name="${name}"]`);
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    renderSearchResults('');
    if (productCard) {
      productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      productCard.style.boxShadow = '0 0 0 3px var(--green-400)';
      setTimeout(() => { productCard.style.boxShadow = ''; }, 2000);
    } else {
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }
  }

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.toggle('active');
    renderSearchResults(searchInput.value);
    if (searchOverlay.classList.contains('active')) {
      setTimeout(() => searchInput.focus(), 300);
    }
  });

  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    renderSearchResults('');
  });

  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return;
      const matches = CATALOG.filter(p => p.name.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q));
      if (matches.length > 0) navigateToProduct(matches[0].name);
    }
  });

  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      searchInput.value = chip.dataset.chip;
      renderSearchResults(chip.dataset.chip);
      searchInput.focus();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('active');
      toggleCart(false);
      closeCheckout();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'searchOverlay') searchOverlay.classList.remove('active');
  });

  /* ---------- Active Nav Link on Scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  /* ---------- Scroll Animations ---------- */
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('animated'), delay * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => observer.observe(el));

  /* ---------- Counter Animation ---------- */
  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      if (target >= 1000) {
        el.textContent = (current / 1000).toFixed(0) + 'K';
        if (current >= target) el.textContent = (target / 1000) + 'K';
      } else {
        el.textContent = current;
      }
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(counter => {
          animateCounter(counter, parseInt(counter.dataset.count));
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

  /* ---------- Product Filter ---------- */
  function bindProductFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.product-card').forEach((card, i) => {
          const category = card.dataset.category;
          const show = filter === 'all' || category === filter;
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          card.style.transitionDelay = (i * 0.05) + 's';
          if (show) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            card.style.display = '';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* ---------- Countdown Timer ---------- */
  function startCountdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);
    endDate.setHours(endDate.getHours() + 14);
    endDate.setMinutes(endDate.getMinutes() + 36);
    function update() {
      const diff = endDate - new Date();
      if (diff <= 0) return;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff / 3600000) % 24);
      const mins = Math.floor((diff / 60000) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      document.getElementById('timerDays').textContent = String(days).padStart(2, '0');
      document.getElementById('timerHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('timerMins').textContent = String(mins).padStart(2, '0');
      document.getElementById('timerSecs').textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }
  startCountdown();

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Card tilt effect on mouse move ---------- */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (card.style.display === 'none') return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Checkout Modal ---------- */

  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutFormView = document.getElementById('checkoutFormView');
  const checkoutSuccessView = document.getElementById('checkoutSuccessView');
  const checkoutForm = document.getElementById('checkoutForm');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const placeOrderLabel = placeOrderBtn.querySelector('.place-order-label');
  const placeOrderLoader = placeOrderBtn.querySelector('.place-order-loader');
  const checkoutSummaryItems = document.getElementById('checkoutSummaryItems');
  const checkoutCloseBtn = document.getElementById('checkoutClose');

  const PAYMENT_LABELS = {
    cod: 'Cash on Delivery'
  };

  function renderCheckoutSummary() {
    let itemsHtml = '';
    cartItemsArray().forEach(item => {
      itemsHtml += `
        <div class="checkout-summary-item">
          <span class="summary-name" title="${item.name}">${item.name}</span>
          <span class="summary-qty">× ${item.qty}</span>
          <span class="summary-line">${formatRs(item.price * item.qty)}</span>
        </div>`;
    });
    checkoutSummaryItems.innerHTML = itemsHtml;

    const totals = calcTotals();
    document.getElementById('csubtotal').textContent = formatRs(totals.subtotal);
    const cdiscountRow = document.getElementById('cdiscountRow');
    cdiscountRow.style.display = totals.discount > 0 ? 'flex' : 'none';
    document.getElementById('cdiscount').textContent = '- ' + formatRs(totals.discount);
    document.getElementById('cdelivery').textContent = totals.delivery === 0 ? 'Free' : formatRs(totals.delivery);
    document.getElementById('ctotal').textContent = formatRs(totals.total);
  }

  function openCheckout() {
    if (getCartCount() === 0) {
      showToast('Your cart is empty');
      return;
    }
    toggleCart(false);
    clearCheckoutErrors();
    checkoutFormView.hidden = false;
    checkoutSuccessView.hidden = true;
    checkoutModal.classList.add('open');
    checkoutOverlay.classList.add('active');
    checkoutModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderCheckoutSummary();
  }

  function closeCheckout() {
    checkoutModal.classList.remove('open');
    checkoutOverlay.classList.remove('active');
    checkoutModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('cartCheckout').addEventListener('click', openCheckout);
  checkoutCloseBtn.addEventListener('click', closeCheckout);
  checkoutOverlay.addEventListener('click', closeCheckout);
  document.getElementById('successDoneBtn').addEventListener('click', closeCheckout);

  /* ---------- Form helpers ---------- */

  function setFieldError(fieldId, message) {
    const group = document.getElementById(fieldId).closest('.form-group');
    if (!group) return;
    group.classList.add('is-invalid');
    group.querySelector('.form-error').textContent = message || 'This field is required';
  }

  function clearFieldError(fieldId) {
    const group = document.getElementById(fieldId).closest('.form-group');
    if (!group) return;
    group.classList.remove('is-invalid');
  }

  function clearCheckoutErrors() {
    checkoutForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('is-invalid'));
  }

  ['coName', 'coPhone', 'coAddress', 'coCity'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => clearFieldError(id));
    el.addEventListener('change', () => clearFieldError(id));
  });

  function setCheckoutLoading(loading) {
    placeOrderLabel.style.display = loading ? 'none' : '';
    placeOrderLoader.style.display = loading ? '' : 'none';
    const btn = placeOrderBtn;
    btn.disabled = loading;
    if (loading) {
      btn.style.opacity = '0.85';
    } else {
      btn.style.opacity = '';
    }
  }

  /* ---------- Place Order ---------- */

  async function placeOrder() {

    clearCheckoutErrors();

    // Frontend validation (mirrors backend rules)
    const name = document.getElementById('coName').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const city = document.getElementById('coCity').value;
    const address = document.getElementById('coAddress').value.trim();
    const notes = document.getElementById('coNotes').value.trim();

    let valid = true;
    if (name.length < 3) { setFieldError('coName', 'Please enter your full name'); valid = false; }
    if (!phone) { setFieldError('coPhone', 'Please enter your mobile number'); valid = false; }
    else if (!/^(\+?92|0)3\d{9}$/.test(phone.replace(/[\s-]/g, ''))) {
      setFieldError('coPhone', 'Enter a valid mobile number e.g. 0300-1234567'); valid = false;
    }
    if (address.length < 10) { setFieldError('coAddress', 'Please enter a complete delivery address'); valid = false; }
    if (!valid) return;

    const paymentMethod = checkoutForm.querySelector('input[name="payment"]:checked').value;

    const payload = {
      customer: { name, phone, address, notes, city },
      paymentMethod: paymentMethod,
      promoCode: activePromo,
      items: cartItemsArray().map(it => ({ name: it.name, price: it.price, qty: it.qty }))
    };

    setCheckoutLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      let res;
      try {
        res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } catch (fetchErr) {
        clearTimeout(timeout);
        if (fetchErr.name === 'AbortError') {
          showToast('Request timed out. Please try again.');
        } else {
          showToast('Network error — check your connection and try again.');
        }
        return;
      }
      clearTimeout(timeout);

      let data;
      try { data = await res.json(); } catch { data = {}; }

      if (!res.ok) {
        if (data.field) {
          setFieldError(data.field, data.message);
        } else {
          showToast(data.message || 'Could not place order. Try again.');
        }
        return;
      }

      showOrderSuccess(data.data);
      clearCart();
    } catch (err) {
      showToast('Something went wrong. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  }

  placeOrderBtn.addEventListener('click', placeOrder);

  // Allow Ctrl/Cmd + Enter in address field to place order
  document.getElementById('coNotes').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') placeOrder();
  });

  function showOrderSuccess(order) {
    document.getElementById('successOrderNumber').textContent = order.orderNumber;
    document.getElementById('successTotal').textContent = formatRs(order.total);
    document.getElementById('successPayment').textContent = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod;
    document.getElementById('successAddress').textContent = order.customer.address + ', ' + order.customer.city;
    document.getElementById('successDelivery').textContent = order.estimatedDelivery || 'Today (2-4 hours)';
    checkoutFormView.hidden = true;
    checkoutSuccessView.hidden = false;
    checkoutModal.scrollTop = 0;
    checkoutSuccessView.scrollTop = 0;
  }

  /* ---------- Init ---------- */

  initPromo();
  renderCart();
  bindProductFilters();
  loadProducts();

});