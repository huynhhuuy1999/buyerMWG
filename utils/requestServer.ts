import axios, { AxiosRequestHeaders, Method } from 'axios';
import {
	ACCESS_TOKEN,
	APP_ID,
	AUTHORIZATION,
	CART_ID,
	DEFAULT_APP_VERSION,
	SIGNATURE,
	WEB_TOKEN,
} from 'constants/index';
import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';
import jwt_decode from 'jwt-decode';
import {
	BaseResponse,
	GuestLoginData,
	GuestLoginPayload,
	LoginData,
	RegistAppIdData,
	RegistAppIdPayload,
	TokenDecode,
} from 'models';
import { provideNewAppId } from 'utils/methods';

const DEFAULT_METHOD: Method = 'GET';

export interface ConfigFetchingProps {
	headers?: AxiosRequestHeaders;
	data?: any;
	params?: any;
	req?: IncomingMessage;
}

export interface FetchingDataProps {
	method?: Method;
	url: string;
	configs: ConfigFetchingProps;
	version?: string;
}

export const parseCookies = (req: IncomingMessage | undefined) => {
	const cookies = {};
	const cookieHeader = req?.headers?.cookie;
	if (!cookieHeader) return cookies;

	cookieHeader.split(';').forEach((cookie) => {
		let [name, ...rest] = cookie.split('=');
		name = name?.trim();
		if (!name) return;
		const value = rest.join('=').trim();
		if (!value) return;
		cookies[name] = decodeURIComponent(value);
	});

	return cookies;
};

export const fetchingDataServer = async (props: FetchingDataProps) => {
	const { method, url, configs, version } = props;

	if (configs?.req && !Boolean(configs.headers?.[AUTHORIZATION])) {
		const cookies = parseCookies(configs.req);
		const accessToken = cookies[ACCESS_TOKEN];
		const webToken = cookies[WEB_TOKEN];

		if (Boolean(accessToken) && Boolean(webToken)) {
			configs.headers = {
				...configs.headers,
				Authorization: `Bearer ${accessToken}`,
				'vv-desktop-webtoken': webToken,
			};
		}
	}

	return axios({
		method: method || DEFAULT_METHOD,
		url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${version ?? 'v1'}${url}`,
		headers: configs?.headers,
		data: configs?.data,
		params: configs?.params,
	}).then((response) => response.data);
};

export const refreshToken = async (req: IncomingMessage, res: ServerResponse) => {
	let isExpired = false;
	const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' });
	const accessToken = cookies.get(ACCESS_TOKEN);
	if (!accessToken) return isExpired;

	isExpired = jwt_decode<TokenDecode>(accessToken).exp < Date.now() / 1000;
	return isExpired;
};

export const appIdentityRegister = async (
	req: IncomingMessage,
	res: ServerResponse,
	isExpired: boolean,
) => {
	const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' });
	const appIdCookies = cookies.get(APP_ID);
	const signatureCookies = cookies.get(SIGNATURE);

	if (appIdCookies && signatureCookies && !isExpired) {
		return {
			appId: appIdCookies,
			signature: signatureCookies,
		};
	}

	try {
		const data: RegistAppIdPayload = {
			appId: provideNewAppId(),
			firebaseToken: '',
		};

		const registData: BaseResponse<RegistAppIdData> = await fetchingDataServer({
			method: 'POST',
			url: '/app/register',
			configs: { data },
		});

		const { appId, signature } = registData?.data as RegistAppIdData;
		cookies.set(APP_ID, appId, {
			httpOnly: false,
			// domain: process.env.NEXT_PUBLIC_ENDPOINT_NAME,
			sameSite: 'lax',
			maxAge: 31536000,
		});
		cookies.set(SIGNATURE, signature, {
			httpOnly: false,
			// domain: process.env.NEXT_PUBLIC_ENDPOINT_NAME,
			sameSite: 'lax',
			maxAge: 31536000,
		});
		return {
			appId: appId,
			signature: signature,
		};
	} catch (error) {
		return Promise.reject(error);
	}
};

export const guestLogin = async (
	req: IncomingMessage,
	res: ServerResponse,
	isExpired: boolean,
	payload: GuestLoginPayload,
) => {
	const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' });
	const accessTokenCookies = cookies.get(ACCESS_TOKEN);
	const webTokenCookies = cookies.get(WEB_TOKEN);

	if (accessTokenCookies && webTokenCookies && !isExpired)
		return {
			accessToken: accessTokenCookies,
			webToken: webTokenCookies,
		};

	try {
		const { appId, signature } = payload;
		const headers: AxiosRequestHeaders = {
			'vv-app-id': appId,
			'vv-app-signature': signature,
			'vv-app-version': DEFAULT_APP_VERSION,
		};
		const loginData: BaseResponse<any> = await fetchingDataServer({
			method: 'POST',
			url: '/account/guestlogin',
			configs: { headers },
		});

		const resp: LoginData = loginData.data;
		const { access_token, web_token, expires_in } = resp;
		cookies.set(ACCESS_TOKEN, access_token, {
			httpOnly: false,
			domain: process.env.NEXT_PUBLIC_ENDPOINT_NAME,
			sameSite: 'lax',
			maxAge: expires_in,
		});
		cookies.set(WEB_TOKEN, web_token, {
			httpOnly: false,
			domain: process.env.NEXT_PUBLIC_ENDPOINT_NAME,
			sameSite: 'lax',
			maxAge: expires_in,
		});
		return {
			accessToken: access_token,
			webToken: web_token,
		};
	} catch (error) {
		return Promise.reject(error);
	}
};

export const fetchNewCart = async (
	req: IncomingMessage,
	res: ServerResponse,
	data: GuestLoginData,
) => {
	const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' });
	const { accessToken, webToken } = data;

	if (Boolean(accessToken) && Boolean(webToken) && !Boolean(cookies.get(CART_ID))) {
		try {
			const headers: AxiosRequestHeaders = {
				Authorization: `Bearer ${accessToken}`,
				'vv-desktop-webtoken': webToken!,
				Accept: 'application/json',
				'content-type': 'application/json',
			};
			const cartData: BaseResponse<string> = await fetchingDataServer({
				method: 'POST',
				url: '/cart',
				configs: { headers },
			});

			const cartId = cartData?.data as string;

			cookies.set(CART_ID, cartId, {
				httpOnly: false,
				sameSite: 'lax',
				maxAge: 31536000,
				domain: process.env.NEXT_PUBLIC_ENDPOINT_NAME,
			});

			return {
				itemsLength: 0,
				cartId,
			};
		} catch (error) {
			// console.log(error);
		}
	}
};
