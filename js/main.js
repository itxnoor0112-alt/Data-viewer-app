import { initTheme, setupThemeToggle } from './theme.js';

let products = [];
const cache = new Map();

// Initialize
initTheme();
setupThemeToggle('theme-toggle');
updateCartCount();
fetchData();

async function fetchData() {
  const grid = document.getElementById('product-grid');
  renderSkeletons(grid);

  try {
    if (cache.has('products')) {
      products = cache.get('products');
    } else {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('API Request Failed');
      products = await res.json();
      cache.set('products', products);
    }

    populateCategories(products);
    renderProducts(products);
  } catch (err) {
    grid.innerHTML = `<p class="col-span-full text-center text-red-500 font-semibold">Error: ${err.message}</p>`;
  }
}

function renderSkeletons(container) {
  container.innerHTML = Array(8).fill(0).map(() => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
      <div class="h-40 skeleton rounded"></div>
      <div class="h-4 skeleton rounded w-3/4"></div>
      <div class="h-4 skeleton rounded w-1/2"></div>
    </div>
  `).join('');
}

function renderProducts(list) {
  const grid = document.getElementById('product-grid');
  if (!list.length) {
    grid.innerHTML = '<p class="col-span-full text-center py-8">No products found matching your search.</p>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col justify-between">
      <img src="${p.image}" class="h-40 object-contain mx-auto mb-4 bg-white p-2 rounded">
      <div>
        <h3 class="font-semibold text-md line-clamp-1">${p.title}</h3>
        <p class="text-blue-600 dark:text-blue-400 font-bold my-2">$${p.price}</p>
      </div>
      <div class="flex gap-2 mt-2">
        <a href="product-details.html?id=${p.id}" class="w-1/2 text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded text-sm">Details</a>
        <button data-id="${p.id}" class="add-btn w-1/2 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">Add</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => addToCart(parseInt(e.target.dataset.id)));
  });
}

function populateCategories(items) {
  const select = document.getElementById('category-filter');
  const categories = [...new Set(items.map(p => p.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.toUpperCase();
    select.appendChild(opt);
  });
}

// Debounce Implementation for Search
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleFilter = () => {
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  const catVal = document.getElementById('category-filter').value;

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchVal);
    const matchesCat = catVal === 'all' || p.category === catVal;
    return matchesSearch && matchesCat;
  });

  renderProducts(filtered);
};

document.getElementById('search-input').addEventListener('input', debounce(handleFilter, 300));
document.getElementById('category-filter').addEventListener('change', handleFilter);

function addToCart(id) {
  const item = products.find(p => p.id === id);
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(x => x.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = total;
}