import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  let productsHTML = "";
  let addedMessageTimeouts = {};

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword ||
        product.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  filteredProducts.forEach((product) => {
      productsHTML += `
          <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${product.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
      `;
  });

  const productsGrid = document.querySelector('.js-products-grid');
  if (productsGrid) productsGrid.innerHTML = productsHTML;
  else console.error('Products grid (.js-products-grid) not found');

    function updateCartQuantity() {
      const cartQuantity = calculateCartQuantity();

      const cartQuantityEl = document.querySelector('.js-cart-quantity');
      if (cartQuantityEl) cartQuantityEl.textContent = cartQuantity;
    }

  updateCartQuantity();

  const searchButton = document.querySelector('.js-search-button');
  const searchBar = document.querySelector('.js-search-bar');
  if (searchButton && searchBar) {
    searchButton.addEventListener('click', () => {
      const search = searchBar.value;
      window.location.href = `amazon.html?search=${search}`;
    });

    searchBar.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const searchTerm = searchBar.value;
        window.location.href = `amazon.html?search=${searchTerm}`;
      }
    });
  }

  const addToCartButtons = document.querySelectorAll('.js-add-to-cart');
  if (addToCartButtons && addToCartButtons.length) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.dataset.productId;

        const userSelection = document.querySelector(
          `.js-quantity-selector-${productId}`
        );
        const selectedNumber = userSelection ? Number(userSelection.value) : 1;

        // Update cart via helper so localStorage gets updated
        addToCart(productId, selectedNumber);

        // Update cart quantity display
        updateCartQuantity();

        const addedMessage = document.querySelector(
          `.js-added-to-cart-${productId}`
        );

        const previousTimeoutId = addedMessageTimeouts[productId];
        if (previousTimeoutId) clearTimeout(previousTimeoutId);

        if (addedMessage) addedMessage.classList.add('added-to-cart-visible');

        addedMessageTimeouts[productId] = setTimeout(() => {
          if (addedMessage) addedMessage.classList.remove('added-to-cart-visible');
        }, 2000);
      });
    });
  }
}