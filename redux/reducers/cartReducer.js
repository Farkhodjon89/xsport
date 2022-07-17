import {
  ADD_TO_CART,
  DECREASE_QUANTITY,
  DELETE_FROM_CART,
  DELETE_ALL_FROM_CART,
} from "../actions/cartActions";

const initState = [];

const cartReducer = (state = initState, action) => {
  const cartItems = state,
    product = action.payload;

  if (action.type === ADD_TO_CART) {
    const cartItem = cartItems.filter(
      (item) =>
        item.id === product.id &&
        product.selectedProductColor &&
        product.selectedProductColor === item.selectedProductColor &&
        product.selectedProductSize &&
        product.selectedProductSize === item.selectedProductSize
    )[0];

    if (cartItem === undefined) {
      return [
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    } else if (
      cartItem !== undefined &&
      (cartItem.selectedProductColor !== product.selectedProductColor ||
        cartItem.selectedProductSize !== product.selectedProductSize)
    ) {
      return [
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    } else {
      return cartItems.map((item) =>
        item.selectedProductId === cartItem.selectedProductId
          ? {
              ...item,
              quantity: product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1,
              selectedProductColor: product.selectedProductColor,
              selectedProductSize: product.selectedProductSize,
            }
          : item
      );
    }
  }

  if (action.type === DECREASE_QUANTITY) {
    if (product.quantity === 1) {
      const remainingItems = (cartItems, product) =>
        cartItems.filter(
          (cartItem) => cartItem.selectedProductId !== product.selectedProductId
        );
      return remainingItems(cartItems, product);
    } else {
      return cartItems.map((item) =>
        item.selectedProductId === product.selectedProductId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }
  }

  if (action.type === DELETE_FROM_CART) {
    const remainingItems = (cartItems) =>
      cartItems.filter((cartItem) => cartItem.selectedProductId !== product);
    return remainingItems(cartItems, product);
  }

  if (action.type === DELETE_ALL_FROM_CART) {
    return cartItems.filter((item) => {
      return false;
    });
  }

  return state;
};

export default cartReducer;
