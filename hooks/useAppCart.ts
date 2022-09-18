import { CART_ID } from 'constants/';
import { useAppSelector } from 'hooks';
import Cookies from 'js-cookie';

import { cartSelector } from '@/store/reducers/cartSlice';

export const useAppCart = () => {
	const cartId = Cookies.get(CART_ID);
	const cartState = useAppSelector(cartSelector);
	return { cartState, cartId };
};
