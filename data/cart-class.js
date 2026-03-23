class Cart {
    cartItems;
    #localStorageKey;

    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
        this.#loadFromStorage();
    }

    #loadFromStorage() {
        this.cartItems  = JSON.parse(localStorage.getItem(this.#localStorageKey));

        if (!this.cartItems) {
            this.cartItems = [];
        }
    }

    saveToStorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }

    addToCart(productId, quantity = 1) {

        let matchingItem;
        
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        if (matchingItem) {
            matchingItem.quantity += quantity;
        } else {
            this.cartItems.push({
                productId: productId,
                quantity: quantity,
                deliveryOptionId: '1',
            });
        }
        this.saveToStorage();
    }

    removeFromCart(productId) {
        const newCart = [];

        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId !== productId) {
                newCart.push(cartItem);
            }
        });

        this.cartItems  = newCart;
        this.saveToStorage();
    }

    calculateCartQuantity() {
        let cartQuantity = 0;

        this.cartItems.forEach((cartItem) => {
            cartQuantity += cartItem.quantity;
        });

        return cartQuantity;
        }

    updateQuantity(productId, newQuantity) {
        if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }

        let matchingItem;

        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        if (matchingItem) {
            matchingItem.quantity = newQuantity;
            this.saveToStorage();
        }
    }

    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;

        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        if(!matchingItem) return;

        matchingItem.deliveryOptionId = deliveryOptionId;

        this.saveToStorage();
    }
}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
