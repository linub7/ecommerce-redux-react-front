let initialstate = [];

// load cart items from localStorage
if (typeof window !== 'undefined') {
  if (localStorage.getItem('cart')) {
    initialstate = JSON.parse(localStorage.getItem('cart'));
  } else {
    initialstate = [];
  }
}

export const cartReducer = (state = initialstate, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_TO_CART':
      return payload;

    default:
      return state;
  }
};
