import { combineReducers } from '@reduxjs/toolkit';

import address from './reducers/address';
import app from './reducers/appSlice';
import auth from './reducers/authSlice';
import brand from './reducers/brandSlice';
import cart from './reducers/cartSlice';
import category from './reducers/categorySlide';
import chat from './reducers/chatSlice';
import comment from './reducers/commentSlice';
import common from './reducers/commonSlice';
import counter from './reducers/counterSlice';
import customer from './reducers/customerSlice';
import productDetail from './reducers/productDetailSlice';
import products from './reducers/productSlice';
import track from './reducers/trackingSlice';
import cookies from './reducers/cookiesSlice';

const rootReducer = combineReducers({
	app,
	cart,
	common,
	productDetail,
	counter,
	auth,
	brand,
	chat,
	category,
	products,
	track,
	address,
	customer,
	comment,
	cookies,
});

export default rootReducer;
