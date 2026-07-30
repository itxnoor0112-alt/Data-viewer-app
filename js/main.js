const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}
let products = [];
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
async function fetchProducts() {
  if (!productGrid) return; 
  productGrid.innerHTML = `
    <div class="col-span-full flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-300">Loading live data...</span>
    </div>
  `;
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) throw new Error('Failed to fetch data');    
    products = await res.json();
    populateCategories(products);
    renderProducts(products);
  } catch (error) {
    productGrid.innerHTML = `
      <div class="col-span-full text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
        <p class="text-red-600 dark:text-red-400 font-semibold mb-2">Error loading products!</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Please check your network connection and try again.</p>
      </div>
    `;
  }
}
function populateCategories(items) {
  if (!categoryFilter) return;
  const categories = ['all', ...new Set(items.map(p => p.category))];
  categoryFilter.innerHTML = categories.map(cat => 
    `<option value="${cat}">${cat.toUpperCase()}</option>`
  ).join('');
}
function renderProducts(items) {
  if (!productGrid) return;

  if (items.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full text-center py-16 text-gray-500 dark:text-gray-400">
        No matching products found. Try adjusting your filters.
      </div>
    `;
    return;
  }
  productGrid.innerHTML = items.map(product => `
    <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-between hover:shadow-lg transition-shadow">
      <div>
        <div class="h-48 w-full bg-white p-4 rounded-lg flex items-center justify-center mb-4">
          <img src="${product.image}" alt="${product.title}" class="h-full object-contain">
        </div>
        <span class="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">${product.category}</span>
        <h3 class="font-bold text-gray-800 dark:text-gray-100 text-base my-2 line-clamp-2" title="${product.title}">${product.title}</h3>
        <p class="text-xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">$${product.price.toFixed(2)}</p>
      </div>      
      <div class="flex flex-col gap-1 pt-2 border-t border-gray-100 dark:border-gray-700">
        <a href="product-details.html?id=${product.id}" 
           class="w-full text-center py-2 px-4 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition font-medium">
          View Details
        </a>
        <button onclick="addToCart(${product.id})" 
                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium active:scale-95">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}
function filterAndSortProducts() {
  let filtered = [...products];
  const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (query) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
  }
  const sortValue = sortSelect ? sortSelect.value : 'default';
  if (sortValue === 'low-to-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'high-to-low') {
    filtered.sort((a, b) => b.price - a.price);
  }
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
  const existingIndex = cart.findIndex(c => c.id === id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`"${item.title.substring(0, 25)}..." added to cart!`);
};
fetchProducts();