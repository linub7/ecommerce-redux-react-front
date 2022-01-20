export const searchReducer = (state = { text: '' }, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SEARCH_QUERY':
      return { ...state, ...payload };

    default:
      return state;
  }
};
