import { initTheme, setupThemeToggle } from './theme.js';

initTheme();
setupThemeToggle('theme-toggle');

async function loadDetails() {
  const container = document.getElementById('details-container');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p class="text-center text-red-500">Invalid Product ID</p>';
    return;
  }

  container.innerHTML = '<div class="h-64 skeleton rounded-lg"></div>';

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();

    container.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow md:flex gap-6">
        <img src="${product.image}" class="h-64 object-contain mx-auto md:w-1/2 bg-white p-4 rounded">
        <div class="md:w-1/2 flex flex-col justify-between mt-4 md:mt-0">
          <div>
            <h1 class="text-2xl font-bold">${product.title}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 my-2">${product.category.toUpperCase()}</p>
            <p class="my-4 text-gray-700 dark:text-gray-300">${product.description}</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">$${product.price}</p>
            <button id="add-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('add-btn').addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(x => x.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart!');
    });

  } catch (err) {
    container.innerHTML = '<p class="text-center text-red-500">Failed to load product details.</p>';
  }
}

loadDetails();