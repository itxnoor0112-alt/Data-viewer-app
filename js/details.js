const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}
const detailsContainer = document.getElementById('details-container');
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
async function fetchProductDetails() {
  if (!productId) {
    detailsContainer.innerHTML = `<p class="text-red-500 text-center">No product selected.</p>`;
    return;
  }
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();
    renderProductDetails(product);
  } catch (error) {
    detailsContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load product details.</p>`;
  }
}
function renderProductDetails(product) {
  detailsContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div class="bg-white p-6 rounded-lg flex justify-center">
        <img src="${product.image}" alt="${product.title}" class="h-64 object-contain">
      </div>
      <div>
        <span class="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">${product.category}</span>
        <h1 class="text-2xl font-bold my-2 text-gray-800 dark:text-gray-100">${product.title}</h1>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${product.description}</p>
        <p class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">$${product.price.toFixed(2)}</p>
        <button onclick="addToCartDetails(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')" 
                class="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}
window.addToCartDetails = function(id, title, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`"${title.substring(0, 20)}..." added to cart!`);
};
fetchProductDetails();