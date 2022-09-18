import axios, { Method } from 'axios';
import { AUTHORIZATION, ACCESS_TOKEN, WEB_TOKEN } from '../constants';
import { FetchingDataProps, parseCookies } from './requestServer';

const DEFAULT_METHOD: Method = 'GET';

interface FetchingDataStaticProps extends FetchingDataProps {
	accessToken: string;
	webToken: string;
}

export const fetchingDataStatic = async (props: FetchingDataProps) => {
	const { method, url, configs, version } = props;

	if (
		Boolean(configs?.headers?.vuivui_access_token) &&
		Boolean(configs?.headers?.vuivui_web_token)
	) {
		// console.log('bearer ', configs?.headers?.accessToken);

		configs.headers = {
			...configs.headers,
			Authorization: `Bearer ${configs?.headers?.vuivui_access_token}`,
			'vv-desktop-webtoken': configs?.headers?.vuivui_web_token || '',
		};
	}

	return axios({
		method: method || DEFAULT_METHOD,
		url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${version ?? 'v1'}${url}`,
		headers: configs?.headers,
		data: configs?.data,
		params: configs?.params,
	}).then((response) => response.data);
};
