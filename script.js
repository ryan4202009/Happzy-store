const MERCH_IMAGES = {
  tee: "VG-SH-46202792.webp",
  hoodie: "51x5xCJeRBL._AC_SX522_.jpg",
  cap: "812xEQHUFcL._AC_SX522_.jpg",
  oversizedTee: "OIP.webp",
  mug: "AAA-Export-Quality-Advertising-Gift-Customized-Logo-White-Sublimation-Mugs-11oz-Plain-White-Blank-Coffee-Custom-Ceramic-Mug.avif"
};

const DESIGN_IMAGE = "Screenshot 2026-10-07 164800.png";

const products = [
  { id: 1, name: "Happzy Classic Tee", desc: "Heavyweight everyday streamer tee — CHUD OF THE YEAR.", price: 29.99, image: MERCH_IMAGES.tee, type: "tee" },
  { id: 2, name: "Happzy Hoodie", desc: "Premium hoodie for the late-night grind — CHUD OF THE YEAR.", price: 59.99, image: MERCH_IMAGES.hoodie, type: "hoodie" },
  { id: 3, name: "Happzy Cap", desc: "Clean community cap featuring CHUD OF THE YEAR.", price: 27.99, image: MERCH_IMAGES.cap, type: "cap" },
  { id: 4, name: "Happzy Oversized Tee", desc: "Relaxed fit with the CHUD OF THE YEAR design.", price: 34.99, image: MERCH_IMAGES.oversizedTee, type: "tee" },
  { id: 5, name: "Happzy Community Hoodie", desc: "A cozy staple for stream nights — CHUD OF THE YEAR.", price: 64.99, image: MERCH_IMAGES.hoodie, type: "hoodie" },
  { id: 6, name: "Happzy Mug", desc: "Your victory drink deserves the CHUD OF THE YEAR design.", price: 18.99, image: MERCH_IMAGES.mug, type: "mug" }
];

let cart = JSON.parse(localStorage.getItem("happzy-cart") || "[]");

const grid = document.getElementById("productGrid");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function money(n) { return `$${n.toFixed(2)}`; }

function productImage(p) {
  return `
    <div class="product-photo">
      <img src="${encodeURI(p.image)}" alt="${p.name}">
      <img class="product-design design-${p.type}" src="${encodeURI(DESIGN_IMAGE)}" alt="CHUD OF THE YEAR design">
    </div>
  `;
}

function renderProducts() {
  grid.innerHTML = products.map(p => `
    <article class="product product-${p.id}">
      <div class="product-image"><div class="product-art image-art">${productImage(p)}</div></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-row">
          <span class="price">${money(p.price)}</span>
          <button class="add" onclick="addToCart(${p.id})">Add to cart</button>
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
    items.innerHTML = `<div class="empty">Your cart is empty.<br>Go grab some merch.</div>`;
    document.getElementById("cartTotal").textContent = "$0.00";
    return;
  }

  let total = 0;
  items.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    total += p.price * item.qty;
    return `<div class="cart-item">
      <div class="cart-thumb image-art"><img src="${encodeURI(p.image)}" alt="${p.name}"></div>
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
  alert("Demo checkout: connect your real merch/payment provider here.");
});

renderProducts();
renderCart();
