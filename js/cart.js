import { initTheme, setupThemeToggle } from './theme.js';
initTheme();
setupThemeToggle('theme-toggle');
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (!cart.length) {
    container.innerHTML = '<p class="py-4 text-gray-500">Your cart is currently empty.</p>';
    totalEl.textContent = '0.00';
    return;
  }
  let total = 0;
  container.innerHTML = cart.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img src="${item.image}" class="w-12 h-12 object-contain bg-white p-1 rounded">
          <div>
            <h4 class="font-semibold">${item.title}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">$${item.price} x ${item.quantity}</p>
          </div>
        </div>
        <button data-id="${item.id}" class="remove-btn text-red-600 hover:underline">Remove</button>
      </div>
    ;
  `}).join('');
  totalEl.textContent = total.toFixed(2);
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart = cart.filter(x => x.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });
}s
renderCart();