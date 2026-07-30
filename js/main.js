const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}
if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
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
let products = [];
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
function updateCartBadge() {
  const cartBadge = document.getElementById('sidebar-cart-count');
  if (!cartBadge) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  cartBadge.textContent = totalCount;
}
async function fetchProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = `<div class="col-span-full text-center py-10">Loading dynamic products...</div>`;
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    products = await res.json();
    populateCategories(products);
    renderProducts(products);
  } catch (error) {
    productGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Failed to load products.</div>`;
  }
}
function populateCategories(items) {
  if (!categoryFilter) return;
  const categories = ['all', ...new Set(items.map(p => p.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat.toUpperCase()}</option>`).join('');
}
function renderProducts(items) {
  if (!productGrid) return;
  if (items.length === 0) {
    productGrid.innerHTML = `<div class="col-span-full text-center py-10">No products found.</div>`;
    return;
  }
  productGrid.innerHTML = items.map(product => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <img src="${product.image}" alt="${product.title}" class="h-48 w-full object-contain mb-4 bg-white p-2 rounded">
        <h3 class="font-bold text-base mb-1 truncate">${product.title}</h3>
        <p class="text-blue-600 dark:text-blue-400 font-bold text-xl mb-4">$${product.price.toFixed(2)}</p>
      </div>
      <div class="flex flex-col gap-2">
        <a href="product-details.html?id=${product.id}" class="text-center py-2 px-4 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition">View Details</a>
        <button onclick="addToCart(${product.id})" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Add to Cart</button>
      </div>
    </div>
  `).join('');
}
function filterAndSortProducts() {
  let filtered = [...products];
  const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
  if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (query) filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
  const sortValue = sortSelect ? sortSelect.value : 'default';
  if (sortValue === 'low-to-high') filtered.sort((a, b) => a.price - b.price);
  else if (sortValue === 'high-to-low') filtered.sort((a, b) => b.price - a.price);
  renderProducts(filtered);
}
function debounce(func, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
if (searchInput) searchInput.addEventListener('input', debounce(filterAndSortProducts, 300));
if (categoryFilter) categoryFilter.addEventListener('change', filterAndSortProducts);
if (sortSelect) sortSelect.addEventListener('change', filterAndSortProducts);
window.addToCart = function(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(c => c.id === id);
  if (existing) existing.quantity = (existing.quantity || 1) + 1;
  else cart.push({ ...item, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  alert(`"${item.title.substring(0, 20)}..." added to cart!`);
};
updateCartBadge();
fetchProducts();