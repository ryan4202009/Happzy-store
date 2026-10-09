const MERCH_IMAGES = {
  tee: "VG-SH-46202792.webp",
  hoodie: "51x5xCJeRBL._AC_SX522_.jpg",
  cap: "812xEQHUFcL._AC_SX522_.jpg",
  oversizedTee: "OIP.webp",
  mug: "AAA-Export-Quality-Advertising-Gift-Customized-Logo-White-Sublimation-Mugs-11oz-Plain-White-Blank-Coffee-Custom-Ceramic-Mug.avif"
};

const DESIGNS = {
  serious: "Screenshot 2026-10-09 081900.png",
  surprised: "Screenshot 2026-10-09 083050.png",
  pink: "Screenshot 2026-10-09 084046.png"
};

const products = [
  { id: 1, name: "The Certified Chud Tee", desc: "Soft shirt. Questionable title. Absolutely immaculate commitment to the bit.", price: 29.99, image: MERCH_IMAGES.tee, design: DESIGNS.surprised, type: "tee" },
  { id: 2, name: "The Stream Goblin Hoodie", desc: "For late-night streams, cold rooms, and saying “one more game” six times.", price: 59.99, image: MERCH_IMAGES.hoodie, design: DESIGNS.serious, type: "hoodie" },
  { id: 3, name: "Happzy #1 Cap", desc: "Bad hair day? Skill issue. Put on the cap and act like a champion.", price: 27.99, image: MERCH_IMAGES.cap, design: DESIGNS.pink, type: "cap" },
  { id: 4, name: "The Extra Comfy Tee", desc: "Roomy fit for maximum lounging and minimum responsibilities.", price: 34.99, image: MERCH_IMAGES.oversizedTee, design: DESIGNS.pink, type: "tee" },
  { id: 5, name: "The Official Couch Uniform", desc: "Cozy enough to wear all stream. We will not judge your screen time.", price: 64.99, image: MERCH_IMAGES.hoodie, design: DESIGNS.surprised, type: "hoodie" },
  { id: 6, name: "The Gamer Fuel Mug", desc: "For coffee, tea, or whatever is keeping you awake at 2:47 AM.", price: 18.99, image: MERCH_IMAGES.mug, design: DESIGNS.serious, type: "mug" }
];

let cart = JSON.parse(localStorage.getItem("happzy-cart") || "[]");

const grid = document.getElementById("productGrid");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  themeToggle.textContent = dark ? "☀️ Light" : "🌙 Dark";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  localStorage.setItem("happzy-theme", theme);
}

const savedTheme = localStorage.getItem("happzy-theme");
applyTheme(savedTheme === "dark" ? "dark" : "light");
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

function money(n) { return `$${n.toFixed(2)}`; }

function productImage(p) {
  const caption = p.type === "cap" ? "HAPPZY #1" : "CHUD OF THE CENTURY";
  const designLayer = p.type === "mug"
    ? `<div class="mug-wrap-strip" style="--mug-art:url('${encodeURI(p.design)}')" role="img" aria-label="Happzy artwork wrapping around the mug"></div>`
    : `<img class="product-design design-${p.type}" src="${encodeURI(p.design)}" alt="Happzy portrait print">`;
  return `
    <div class="product-photo product-photo-${p.type}">
      <img src="${encodeURI(p.image)}" alt="${p.name}">
      ${designLayer}
      <span class="design-caption caption-${p.type}">${caption}</span>
    </div>
  `;
}

function renderProducts() {
  grid.innerHTML = products.map(p => `
    <article class="product product-${p.id}">
      <div class="product-image" aria-label="Drag to rotate ${p.name}"><div class="product-art image-art" data-rotatable>${productImage(p)}</div><span class="rotate-hint">↔ Give it a spin · double-click to reset</span></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-row">
          <span class="price">${money(p.price)}</span>
          <button class="add" onclick="addToCart(${p.id})">Gimme that</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });
  save();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  save();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else save();
}

function save() {
  localStorage.setItem("happzy-cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const items = document.getElementById("cartItems");
  const count = cart.reduce((sum, x) => sum + x.qty, 0);
  document.getElementById("cartCount").textContent = count;

  if (!cart.length) {
    items.innerHTML = `<div class="empty">It’s emptier than chat during a scuffed stream.<br>Go fix that with some merch.</div>`;
    document.getElementById("cartTotal").textContent = "$0.00";
    return;
  }

  let total = 0;
  items.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    total += p.price * item.qty;
    return `<div class="cart-item">
      <div class="cart-thumb cart-thumb-${p.type} image-art"><img class="cart-thumb-base" src="${encodeURI(p.image)}" alt="${p.name}"><img class="cart-thumb-design" src="${encodeURI(p.design)}" alt="Design on ${p.name}"></div>
      <div><strong>${p.name}</strong><br><small>${money(p.price)} × ${item.qty}
      <button class="remove" onclick="changeQty(${p.id},-1)">−</button>
      <button class="remove" onclick="changeQty(${p.id},1)">+</button></small></div>
      <button class="remove" onclick="removeFromCart(${p.id})">×</button>
    </div>`;
  }).join("");

  document.getElementById("cartTotal").textContent = money(total);
}

function openCart() {
  drawer.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", () => {
  // Send shoppers to the Happzy Streamlabs tip page.
  window.location.href = "https://streamlabs.com/happzy/tip";
});


 // Drag or swipe product mockups for a 3D perspective preview.
let activeViewer = null;
document.addEventListener("pointerdown", event => {
  const viewer = event.target.closest("[data-rotatable]");
  if (!viewer || event.target.closest("button")) return;
  activeViewer = { viewer, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
    rotateY: Number(viewer.dataset.rotateY || 0), rotateX: Number(viewer.dataset.rotateX || 0) };
  viewer.classList.add("is-dragging");
  viewer.setPointerCapture?.(event.pointerId);
});
document.addEventListener("pointermove", event => {
  if (!activeViewer || event.pointerId !== activeViewer.pointerId) return;
  const dx = event.clientX - activeViewer.startX;
  const dy = event.clientY - activeViewer.startY;
  const y = Math.max(-65, Math.min(65, activeViewer.rotateY + dx * 0.65));
  const x = Math.max(-18, Math.min(18, activeViewer.rotateX - dy * 0.25));
  activeViewer.viewer.dataset.rotateY = y;
  activeViewer.viewer.dataset.rotateX = x;
  activeViewer.viewer.style.transform = `perspective(900px) rotateX(${x}deg) rotateY(${y}deg)`;
});
function stopProductDrag(event) {
  if (!activeViewer || (event.pointerId !== undefined && event.pointerId !== activeViewer.pointerId)) return;
  activeViewer.viewer.classList.remove("is-dragging");
  activeViewer = null;
}
document.addEventListener("pointerup", stopProductDrag);
document.addEventListener("pointercancel", stopProductDrag);
document.addEventListener("dblclick", event => {
  const viewer = event.target.closest("[data-rotatable]");
  if (!viewer) return;
  viewer.dataset.rotateY = "0";
  viewer.dataset.rotateX = "0";
  viewer.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
});

renderProducts();
renderCart();
