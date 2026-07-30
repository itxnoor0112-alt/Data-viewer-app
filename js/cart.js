const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
function toggleSidebar() {
  if (!sidebar) return;
  sidebar.classList.toggle('-translate-x-full');
  if (sidebarOverlay) sidebarOverlay.classList.toggle('hidden');
}
if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const totalPriceEl = document.getElementById('cart-total-price');
  const sidebarBadge = document.getElementById('sidebar-cart-count');  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItemsCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  if(sidebarBadge) sidebarBadge.textContent = totalItemsCount;
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400 text-lg mb-4">Your cart is currently empty.</p>
        <a href="index.html" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Explore Products</a>
      </div>
    `;
    totalPriceEl.textContent = '$0.00';
    return;
  }
  let totalSum = 0;
  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * (item.quantity || 1);
    totalSum += itemTotal;
    return `
      <div class="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain bg-white p-2 rounded">
          <div>
            <h3 class="font-bold text-sm max-w-xs truncate">${item.title}</h3>
            <p class="text-sm text-gray-500">$${item.price.toFixed(2)} each</p>
          </div>
        </div>
        <!-- Day 4 Quantity Controls -->
        <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button onclick="changeQty(${index}, -1)" class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">-</button>
            <span class="px-3 py-1 text-sm font-semibold">${item.quantity || 1}</span>
            <button onclick="changeQty(${index}, 1)" class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">+</button>
          </div>          
          <span class="font-bold text-blue-600 dark:text-blue-400 w-20 text-right">$${itemTotal.toFixed(2)}</span>         
          <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-700 font-bold text-lg p-1">✕</button>
        </div>
      </div>
    `;
  }).join('');
  totalPriceEl.textContent = `$${totalSum.toFixed(2)}`;
}
window.changeQty = function(index, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;
  cart[index].quantity = (cart[index].quantity || 1) + delta; 
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
};
window.removeItem = function(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
};
const clearBtn = document.getElementById('clear-cart-btn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');
    renderCart();
  });
}
renderCart();