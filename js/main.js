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
let filteredProductsList = [];
let currentPage = 1;
const itemsPerPage = 8;
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const paginationContainer = document.getElementById('pagination-container');
const prevBtn = document.getElementById('prev-page-btn');
const nextBtn = document.getElementById('next-page-btn');
const pageIndicator = document.getElementById('page-indicator');
const fallbackProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Product Item ${i + 1}`,
  price: (i + 1) * 14.99,
  category: i % 2 === 0 ? "men's clothing" : "electronics",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
}));
function updateCartBadge() {
  const cartBadge = document.getElementById('sidebar-cart-count');
  if (!cartBadge) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  cartBadge.textContent = totalCount;
}
function showSkeletons() {
  if (!productGrid) return;
  productGrid.innerHTML = Array(itemsPerPage).fill(0).map(() => `
    <div class="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl h-80 p-4 flex flex-col justify-between">
      <div class="bg-gray-300 dark:bg-gray-600 h-40 w-full rounded-xl"></div>
      <div class="space-y-2 mt-4">
        <div class="bg-gray-300 dark:bg-gray-600 h-4 w-3/4 rounded"></div>
        <div class="bg-gray-300 dark:bg-gray-600 h-4 w-1/2 rounded"></div>
      </div>
      <div class="space-y-2 mt-4">
        <div class="bg-gray-300 dark:bg-gray-600 h-8 w-full rounded-lg"></div>
        <div class="bg-gray-300 dark:bg-gray-600 h-8 w-full rounded-lg"></div>
      </div>
    </div>
  `).join('');
}
async function fetchProducts() {
  if (!productGrid) return;
  showSkeletons();
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    if (data && Array.isArray(data) && data.length > 0) {
      products = [...data];
    } else {
      products = [...fallbackProducts];
    }
  } catch (error) {
    console.warn("API Failed, using fallback data:", error);
    products = [...fallbackProducts];
  }
  populateCategories(products);
  filterAndSortProducts();
}
function populateCategories(items) {
  if (!categoryFilter) return;
  const categories = ['all', ...new Set(items.map(p => p.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat.toUpperCase()}</option>`).join('');
}
function renderProducts(items) {
  if (!productGrid) return;
  if (items.length === 0) {
    productGrid.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">No products found.</div>`;
    if (paginationContainer) paginationContainer.classList.add('hidden');
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
function renderPaginatedProducts() {
  const totalPages = Math.ceil(filteredProductsList.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBatch = filteredProductsList.slice(startIndex, endIndex);
  renderProducts(currentBatch);
  if (totalPages > 1 && paginationContainer) {
    paginationContainer.classList.remove('hidden');
    if (pageIndicator) pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  } else if (paginationContainer) {
    paginationContainer.classList.add('hidden');
  }
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
  filteredProductsList = filtered;
  currentPage = 1;
  renderPaginatedProducts();
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
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPaginatedProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProductsList.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage--;
      currentPage += 2;
      renderPaginatedProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
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