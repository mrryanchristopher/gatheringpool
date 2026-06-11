const products = [
  { id: 1, name: '“I Have the Best Words” Ceramic Mug', category: 'Mugs', price: 18, color: 'Red', image: 'https://quotingtrump.com/wp-content/uploads/2024/08/cropped-quotingtrump-1.png', tag: 'Bestseller', quote: 'I have the best words.' },
  { id: 2, name: 'Covfefe Classic Tee', category: 'Tees', price: 28, color: 'Navy', image: 'https://quotingtrump.com/wp-content/uploads/2024/08/quotingtrump.png', tag: 'New', quote: 'Despite the constant negative press covfefe.' },
  { id: 3, name: 'M.A.G.A Satire Hoodie', category: 'Hoodies', price: 56, color: 'Black', image: 'https://quotingtrump.com/wp-content/uploads/2024/08/qt-logo.png', tag: 'Limited', quote: 'Make America Grope Again.' },
  { id: 4, name: 'Felonious 47th Dad Hat', category: 'Hats', price: 24, color: 'Stone', image: 'https://quotingtrump.com/wp-content/uploads/2024/08/quoting-trump-logo.png', tag: 'Popular', quote: 'Talk about a comeback.' },
  { id: 5, name: '“Big Water” Phone Case', category: 'Phone Cases', price: 22, color: 'White', image: 'https://quotingtrump.com/wp-content/uploads/2024/08/quotingtrump-logo.png', tag: 'Gift pick', quote: 'Puerto Rico is surrounded by water. Big water.' },
  { id: 6, name: 'Custom Quote Bundle', category: 'Custom', price: 44, color: 'Mix', image: 'https://quotingtrump.com/wp-content/uploads/2024/08/cropped-quotingtrump.png', tag: 'Custom', quote: 'Pick any real quote and we print it.' },
];

const fallbackArt = { Mugs: '☕', Tees: '👕', Hoodies: '🧥', Hats: '🧢', 'Phone Cases': '📱', Custom: '✨' };
let cart = {};
let filter = 'All';

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const grid = document.querySelector('#product-grid');
const filters = document.querySelector('#filters');
const cartCount = document.querySelector('#cart-count');
const cartTitle = document.querySelector('#cart-title');
const cartLines = document.querySelector('#cart-lines');
const subtotal = document.querySelector('#subtotal');
const checkout = document.querySelector('#checkout');

function productArt(product) {
  return `<div class="product-art" aria-label="${product.name} product art">
    <img src="${product.image}" alt="Quoting Trump source asset" onerror="this.remove(); this.parentElement.querySelector('.fallback-art').hidden = false" />
    <div class="fallback-art" hidden><span>${fallbackArt[product.category]}</span><b>${product.category}</b></div>
    <div class="quote-strip"><span>❝</span>${product.quote}</div>
  </div>`;
}

function renderFilters() {
  const categories = ['All', ...new Set(products.map((product) => product.category))];
  filters.innerHTML = categories.map((category) => `<button class="${filter === category ? 'active' : ''}" data-filter="${category}">${category}</button>`).join('');
}

function renderProducts() {
  const visibleProducts = products.filter((product) => filter === 'All' || product.category === filter);
  grid.innerHTML = visibleProducts.map((product) => `<article class="product-card">
    <span class="product-tag">${product.tag}</span><button class="heart" aria-label="Save ${product.name}">♡</button>${productArt(product)}
    <div class="product-info"><p>${product.category} · ${product.color}</p><h3>${product.name}</h3><div class="buy-row"><strong>${formatter.format(product.price)}</strong><button data-add="${product.id}">Add to cart</button></div></div>
  </article>`).join('');
}

function updateCart(productId, delta) {
  const nextQuantity = Math.max((cart[productId] || 0) + delta, 0);
  if (nextQuantity) cart[productId] = nextQuantity; else delete cart[productId];
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [productId, quantity]) => sum + products.find((product) => product.id === Number(productId)).price * quantity, 0);
  cartCount.textContent = itemCount;
  cartTitle.textContent = itemCount ? `${itemCount} item${itemCount > 1 ? 's' : ''} ready` : 'Your cart is currently empty';
  cartLines.innerHTML = entries.map(([productId, quantity]) => {
    const product = products.find((item) => item.id === Number(productId));
    return `<div class="cart-line"><span>${product.name}</span><div><button data-remove="${product.id}" aria-label="Remove one ${product.name}">−</button><b>${quantity}</b><button data-add="${product.id}" aria-label="Add one ${product.name}">+</button></div><strong>${formatter.format(product.price * quantity)}</strong></div>`;
  }).join('');
  subtotal.textContent = formatter.format(total);
  checkout.disabled = itemCount === 0;
}

filters.addEventListener('click', (event) => {
  if (!event.target.matches('[data-filter]')) return;
  filter = event.target.dataset.filter;
  renderFilters();
  renderProducts();
});

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  const removeButton = event.target.closest('[data-remove]');
  if (addButton) updateCart(Number(addButton.dataset.add), 1);
  if (removeButton) updateCart(Number(removeButton.dataset.remove), -1);
});

document.querySelector('#menu-toggle').addEventListener('click', () => {
  document.querySelector('#site-nav').classList.toggle('open');
});

renderFilters();
renderProducts();
renderCart();
