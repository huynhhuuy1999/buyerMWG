import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import cookies from 'js-cookie';

import { APP_ID, SIGNATURE, VV_APP_ID, VV_APP_SIGNATURE } from '../constants';
enum REQUEST_TIMEOUT {
	default = 30000,
}

const appId = cookies.get(APP_ID);
const signature = cookies.get(SIGNATURE);

const request = axios.create({
	baseURL: process.env.NEXT_PUBLIC_DOMAIN_API_URL!,
	timeout: REQUEST_TIMEOUT.default,
});

const requestV2 = axios.create({
	baseURL: process.env.NEXT_PUBLIC_DOMAIN_API_URL!,
	timeout: REQUEST_TIMEOUT.default,
});

const InterceptorsRequest = async (config: AxiosRequestConfig) => {
	return config;
};

const InterceptorsError = (error: any) => {
	return Promise.reject(error);
};

const InterceptorResponse = (response: AxiosResponse) => {
	if (response && response.data) {
		return response.data;
	}

	return response;
};

request.defaults.headers.common = {
	[VV_APP_ID]: appId!,
	[VV_APP_SIGNATURE]: signature!,
};

request.interceptors.request.use(InterceptorsRequest, InterceptorsError);
request.interceptors.response.use(InterceptorResponse, InterceptorsError);

requestV2.interceptors.request.use(InterceptorsRequest, InterceptorsError);
requestV2.interceptors.response.use(InterceptorResponse, InterceptorsError);

export { requestV2 };

export default request;
