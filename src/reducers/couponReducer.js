export const couponReducer = (state = false, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'COUPON_APPLIED':
      return payload;

    default:
      return state;
  }
};
