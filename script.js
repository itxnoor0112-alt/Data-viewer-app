let allProducts = [];
const API_URL = 'https://fakestoreapi.com/products';

const productGrid = document.getElementById('productGrid');
const errorMessage = document.getElementById('errorMessage');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

function renderSkeletons() {
  productGrid.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const skeletonHTML = `
      <div class="bg-slate-800 rounded-lg p-4 animate-pulse-custom flex flex-col justify-between h-80">
        <div class="w-full h-40 bg-slate-700 rounded-md mb-4"></div>
        <div class="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
        <div class="h-6 bg-slate-700 rounded w-1/3"></div>
      </div>
    `;
    productGrid.insertAdjacentHTML('beforeend', skeletonHTML);
  }
}

function renderProducts(products) {
  productGrid.innerHTML = '';

  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-8">No products found.</p>`;
    return;
  }

  products.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col justify-between hover:border-indigo-500 transition-all shadow-md";
    card.innerHTML = `
      <div>
        <img src="${item.image}" alt="${item.title}" class="w-full h-40 object-contain mb-4 rounded bg-white p-2">
        <h3 class="font-semibold text-lg line-clamp-1 mb-1">${item.title}</h3>
        <p class="text-xs text-indigo-400 font-medium uppercase tracking-wider mb-2">${item.category}</p>
      </div>
      <div class="flex justify-between items-center mt-4">
        <span class="text-xl font-bold text-green-400">$${item.price}</span>
        <button class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-1.5 rounded transition">View</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function filterProducts() {
  const searchTerm = (searchInput.value || '').toLowerCase().trim();
  const selectedCategory = (categoryFilter.value || '').toLowerCase().trim();

  const filtered = allProducts.filter(product => {
    const title = (product.title || '').toLowerCase();
    const category = (product.category || '').toLowerCase().trim();

    const matchesSearch = title.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

function setupTheme() {
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.replace('bg-slate-900', 'bg-slate-100');
    document.body.classList.replace('text-white', 'text-slate-900');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = 'Light Mode';
  } else {
    document.body.classList.replace('bg-slate-100', 'bg-slate-900');
    document.body.classList.replace('text-slate-900', 'text-white');
    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeText) themeText.textContent = 'Dark Mode';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('bg-slate-900');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    setupTheme();
  });
}

async function fetchProducts() {
  renderSkeletons();
  if (errorMessage) errorMessage.classList.add('hidden');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Server error occurred!");

    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    productGrid.innerHTML = '';
    if (errorMessage) {
      errorMessage.textContent = "Data load nahi ho saka. Internet connection check karein!";
      errorMessage.classList.remove('hidden');
    }
    console.error("Fetch Error:", error);
  }
}

if (searchInput) searchInput.addEventListener('input', filterProducts);
if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);

setupTheme();
fetchProducts();