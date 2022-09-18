import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

import { appActions } from '@/store/reducers/appSlice';

import { store } from '../store';

export const getCookie = (key: string) => Cookies.get(key);

export const setCookie = (key: string, value: any) => {
	return value ? Cookies.set(key, value) : null;
};

export const deleteCookie = (key: string) => Cookies.remove(key);

export const convertToHexString = (key: string) => {
	var result = '';
	for (var index = 0; index < key.length; index++) {
		result += key.charCodeAt(index).toString(16);
	}
	return result;
};

export const provideNewAppId = () => {
	return convertToHexString(uuidv4());
};

export const isNumber = (value: any) => {
	return /^-?[\d.]+(?:e-?\d+)?$/.test(value);
};

export const getLocationCurrent = (callback?: any) => {
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			store.dispatch(
				appActions.setCurrentLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				}),
			);
			callback && callback();
		},
		(err) => {
			return {};
		},
	);
};

export const roundNumber = (value: number, precision?: number) => {
	let multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
};
