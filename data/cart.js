export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [];
}

export function addToCart(productId, quantity = 1) {

    let matchingItem;
    
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            deliveryOptionId: '1',
        });
    }
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;
    saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
    if (newQuantity === 0) {
        removeFromCart(productId);
        return;
    }

    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity = newQuantity;
        saveToStorage();
    }
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if(!matchingItem) return;

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}

export function loadCart(fun) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
        console.log(xhr.response)

        fun();
    });

    xhr.open('GET', 'https://supersimplebackend.dev/cart');
    xhr.send();
}

export function resetCart() {
  cart = [];
  saveToStorage();
}
