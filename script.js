const products = [
  { id: 1, name: "Happzy Classic Tee", desc: "Heavyweight everyday streamer tee.", price: 29.99, art: "🏆" },
  { id: 2, name: "Happzy Hoodie", desc: "Premium hoodie for the late-night grind.", price: 59.99, art: "👕" },
  { id: 3, name: "Happzy Cap", desc: "Clean embroidered-style community cap.", price: 27.99, art: "🧢" },
  { id: 4, name: "Happzy Oversized Tee", desc: "Relaxed fit with a bold front mark.", price: 34.99, art: "⭐" },
  { id: 5, name: "Happzy Community Hoodie", desc: "A cozy staple for stream nights.", price: 64.99, art: "🏆" },
  { id: 6, name: "Happzy Mug", desc: "Your victory drink deserves a trophy.", price: 18.99, art: "☕" }
];

let cart = JSON.parse(localStorage.getItem("happzy-cart") || "[]");

const grid = document.getElementById("productGrid");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function money(n) { return `$${n.toFixed(2)}`; }

function renderProducts() {
  grid.innerHTML = products.map(p => `
    <article class="product">
      <div class="product-image"><div class="product-art">${p.art}</div></div>
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
      <div class="cart-thumb">${p.art}</div>
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
