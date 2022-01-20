export const cashOnDeliveryReducer = (state = false, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'CASH_ON_DELIVERY':
      return payload;

    default:
      return state;
  }
};
