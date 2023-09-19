export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';

// add item to cart
export const addToCart = (item: any) => ({
    type: ADD_TO_CART,
    payload: item
});

// remove item from cart
export const removeFromCart = (item: any) => ({
    type: REMOVE_FROM_CART,
    payload: item
});

// clear cart
export const clearCart = () => ({
    type: CLEAR_CART
});
