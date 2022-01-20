import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { cashOnDeliveryReducer } from './cashOnDeliveryReducer';
import { couponReducer } from './couponReducer';
import { drawerReducer } from './drawerReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  coupon: couponReducer,
  cashOnDelivery: cashOnDeliveryReducer,
});

export default rootReducer;
