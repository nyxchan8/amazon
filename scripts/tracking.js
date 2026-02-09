import {getOrder} from '../data/orders.js';
import {getProduct, loadProductsFetch} from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  // Get additional details about the product like the estimated delivery time.
  let productDetails;
  if (order && Array.isArray(order.products)) {
    order.products.forEach((details) => {
      if (details.productId === product.id) {
        productDetails = details;
      }
    });
  }

  const container = document.querySelector('.js-order-tracking');
  if (!container) {
    console.error('Tracking container (.js-order-tracking) not found in DOM');
    return;
  }

  if (!order || !product || !productDetails) {
    console.error('Order, product, or product details missing', { orderId, productId, order, product, productDetails });
    container.innerHTML = '<div class="error">Order or product details not found.</div>';
    return;
  }

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

  // Use dayjs.diff to compute progress and clamp between 0 and 100
  let percentProgress = (today.diff(orderTime) / deliveryTime.diff(orderTime)) * 100;
  if (!isFinite(percentProgress)) percentProgress = 0;
  percentProgress = Math.max(0, Math.min(100, percentProgress));

  const deliveredMessage = today.isBefore(deliveryTime) ? 'Arriving on' : 'Delivered on';

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      ${deliveredMessage} ${dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}" alt="${product.name}">

    <div class="progress-labels-container">
      <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
        Preparing
      </div>

      <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}">
        Shipped
      </div>

      <div class="progress-label ${percentProgress >= 100 ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  container.innerHTML = trackingHTML;
}

// Ensure we run after the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPage);
} else {
  loadPage();
}