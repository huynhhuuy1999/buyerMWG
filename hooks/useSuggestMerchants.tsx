import useSWR, { SWRConfiguration } from 'swr';

import { ParamSearchProduct } from '../models';
import { fetchSuggestMerchant } from '../services';

export const fetchData = (url: string, params: ParamSearchProduct | Record<any, any>) => {
	let ids = '';
	const newParams: any = Object.assign({}, params);

	Object.keys(newParams).map((key) => {
		if (Array.isArray(params[key])) {
			params[key].forEach((item: any, index: number, array: any) => {
				ids += `${key}=${encodeURIComponent(item)}&`;
			});

			delete newParams[key];
		}
	});

	return fetchSuggestMerchant(`${url}?${ids}`, newParams);
};

export const useSuggestMerchant = (
	endpoint: string,
	queryParams?: ParamSearchProduct,
	option?: SWRConfiguration,
) => {
	const { data, error, mutate, isValidating } = useSWR([endpoint, queryParams], fetchData, option);
	return { data, error, mutate, isValidating };
};
